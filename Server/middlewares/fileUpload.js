import multer from "multer"
import { S3Client } from "@aws-sdk/client-s3"
import multerS3 from "multer-s3"

const s3 = new S3Client({
  forcePathStyle: true,
  region: "ap-south-1",
  endpoint: "https://ubdoookogsggsyatrrkh.storage.supabase.co/storage/v1/s3",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
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

const uploadMiddleware = (req, res, next) => {
  const handler = upload.single("somefile")

  handler(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err, "muter error")
      res.status(400).json({ err })
      return
    } else if (err) {
      console.log(err, "else error")
      res.status(500).json({ err })
      return
    }
    next()
  })
}

export default uploadMiddleware
