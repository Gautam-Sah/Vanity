import mongoose from "mongoose"

const connectDb = async (uri) => {
  try {
    await mongoose.connect(uri)
    console.log("Database connected")
  } catch (error) {
    console.error("Database connection failed")
    throw error
  }
}

export default connectDb
