import History from "../models/history.js"

const getHistory = async (req, res) => {
  try {
    // Only get history for the authenticated user
    const history = await History.find({ createdBy: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-__v")

    res.status(200).json({ history })
  } catch (error) {
    console.error("Error fetching history:", error.message)
    res.status(500).json({
      error: "Failed to fetch history",
      details: error.message,
    })
  }
}

export default getHistory
