import express from "express"
const Router = express.Router()
import checkFact from "../controllers/checkFact.js"
import getHistory from "../controllers/getHistory.js"
import authMiddleware from "../middlewares/auth.js"

// Protected routes - require authentication
Router.post("/fact-check", authMiddleware, checkFact)
Router.get("/history", authMiddleware, getHistory)

export default Router
