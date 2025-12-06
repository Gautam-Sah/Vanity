import "express-async-errors"
import dotenv from "dotenv"
dotenv.config()
import express from "express"
import multer from "multer"
import { S3Client } from "@aws-sdk/client-s3"
import multerS3 from "multer-s3"
const s3 = new S3Client({
  forcePathStyle: true,
  region: "ap-south-1",
  endpoint: "https://ubdoookogsggsyatrrkh.storage.supabase.co/storage/v1/s3",
  credentials: {
    accessKeyId: "0c7678583058fc814e066a9b21538672",
    secretAccessKey:
      "115a4997c305222e2f3cd1fb35b9d5a2005bdb503a5ead6738d7ea32bd1dce12",
  },
})

// const storage = multer.diskStorage({
//   destination: function (req, file, setDest) {
//     setDest(null, "uploads/")
//   },
//   filename: function (req, file, setFileName) {
//     setFileName(null, file.originalname)
//   },
// })
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "test",
    acl: "private",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname)
    },
  }),
})

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

app.post("/file-upload", upload.single("somefile"), (req, res) => {
  console.log(req.file, req.body)
  res.status(200).send("uploaded")
})

app.use("/api/auth", authRoutes)
app.use("/", factCheck)

app.use(errorHandler)

app.use(notFound)

const port = process.env.PORT || 8080

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI)
    app.listen(port, () => console.log("app is listening on port 8080"))
  } catch (error) {
    console.log(`error occured ${error}`)
  }
}

start()
