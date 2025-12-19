import "express-async-errors"

import "dotenv/config"

import express from "express"

const app = express()

// security Packages
import helmet from "helmet"
import cors from "cors"

import rateLimiter from "express-rate-limit"

//connectDB
import connectDb from "./DB/connect.js"

// Router
import factCheck from "./routes/router.js"
import authRoutes from "./routes/auth.js"

//Error Handler
import errorHandler from "./middlewares/error-handler.js"
import notFound from "./middlewares/not-found.js"

app.use(helmet())
app.use(cors())

app.set("trust proxy", 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
  })
)
app.use(express.json())
// app.use(express.static("./public"))

app.use("/api/auth", authRoutes)
app.use("/", factCheck)
app.use("/test", (req, res) => res.send("test"))
app.use(errorHandler)

app.use(notFound)

const port = process.env.PORT || 8080

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI)
    app.listen(port, "0.0.0.0", () =>
      console.log("app is listening on port 8080")
    )
  } catch (error) {
    console.log(`error occured ${error}`)
  }
}

start()
