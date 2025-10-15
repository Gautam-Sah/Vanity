import axios from "axios"
import BadRequest from "../errors/bad-request.js"
import OpenAI from "openai"
import History from "../models/history.js"

const checkFact = async (req, res) => {
  const FACT_CHECK_API_KEY = process.env.FACT_CHECK_API_KEY
  const GROQ_API_KEY = process.env.GROQ_API_KEY

  if (!FACT_CHECK_API_KEY) {
    return res
      .status(500)
      .json({ error: "Google FACT_CHECK_API_KEY is missing" })
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY is missing" })
  }

  const { claimText } = req.body
  if (!claimText) {
    throw new BadRequest("claim text is required")
  }

  const openai = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  })

  let claims = []
  try {
    const response = await axios.get(
      "https://factchecktools.googleapis.com/v1alpha1/claims:search",
      {
        params: {
          key: FACT_CHECK_API_KEY,
          query: claimText,
          languageCode: "en",
          pageSize: 3,
        },
      }
    )

    claims = response.data.claims || []
    console.log("Fact Check results:", claims)
  } catch (googleError) {
    console.error("Fact Check API error:", googleError.message)

    return res.status(500).json({
      error: "Failed to fetch Fact Check results",
      details: googleError.response?.data || googleError.message,
    })
  }

  if (claims.length === 0) {
    return res.status(404).json({ message: "No fact checks found." })
  }

  const prompt = `
      Claim: ${claimText}
      Fact-check results: ${JSON.stringify(claims.slice(0, 2), null, 2)}
      Search up and fetch data from url of claim reviews. Give information about source of misinformation and summarize the reviews. 
      Summarize the results in a few paragraphs and declare the claim seems TRUE, FALSE, or UNSURE.
    `

  let summary = "No summary generated."
  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful fact-checking assistant.",
        },
        { role: "user", content: prompt },
      ],
    })
    summary = completion.choices?.[0]?.message?.content || summary
    console.log(summary)

    // Extract verdict from summary
    let verdict = "UNSURE"
    const summaryUpper = summary.toUpperCase()
    if (summaryUpper.includes("TRUE") && !summaryUpper.includes("FALSE")) {
      verdict = "TRUE"
    } else if (summaryUpper.includes("FALSE") && !summaryUpper.includes("TRUE")) {
      verdict = "FALSE"
    } else if (summaryUpper.includes("TRUE") && summaryUpper.includes("FALSE")) {
      verdict = "MIXED"
    }

    // Save to database
    try {
      const historyEntry = await History.create({
        claimText,
        summary,
        verdict,
        claims: claims.slice(0, 2),
        createdBy: req.user.userId,
      })
      console.log("Saved to history:", historyEntry._id)
    } catch (dbError) {
      console.error("Failed to save to database:", dbError.message)
      // Continue even if database save fails
    }

    res.status(200).json({ summary })
  } catch (GROQError) {
    console.error("GROQ API error:", GROQError.message)
    return res.status(500).json({
      error: "Failed to summarize with GROQ",
      details: GROQError.message,
    })
  }
}
export default checkFact
