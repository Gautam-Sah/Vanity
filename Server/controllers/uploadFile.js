import { createClient } from "@supabase/supabase-js"
import BadRequest from "../errors/bad-request.js"
import { createWorker } from "tesseract.js"

const uploadFile = async (req, res, err) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY
    )
    if (!req.file) {
      // throw new BadRequest("no file uploaded")
      return res.status(400).json({ msg: "no file uploaded" })
    }
    const bucket = "test"
    const fileKey = await req.file.key
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileKey, 86400)
    if (error) {
      console.log(error.message, "iferror")
      return res.status(500).json({ error: error.message })
    }
    const worker = await createWorker("eng", 1, {
      logger: (m) => console.log(m),
    })
    const {
      data: { text: result },
    } = await worker.recognize(data.signedUrl)

    console.log(result)

    return res.json({
      success: true,
      fileKey,
      signedUrl: data.signedUrl,
      text: result,
    })
  } catch (err) {
    console.log(err, "catch error")
  }
}

export default uploadFile
