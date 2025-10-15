import User from "../models/user.js"
import jwt from "jsonwebtoken"
import BadRequest from "../errors/bad-request.js"
import { StatusCodes } from "http-status-codes"

// Register new user
const register = async (req, res) => {
  const { name, email, password } = req.body

  // Validation
  if (!name || !email || !password) {
    throw new BadRequest("Please provide name, email, and password")
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new BadRequest("Email already registered")
  }

  // Create user
  const user = await User.create({ name, email, password })

  // Create JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME || "30d" }
  )

  res.status(StatusCodes.CREATED).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  })
}

// Login user
const login = async (req, res) => {
  const { email, password } = req.body

  // Validation
  if (!email || !password) {
    throw new BadRequest("Please provide email and password")
  }

  // Find user
  const user = await User.findOne({ email })
  if (!user) {
    throw new BadRequest("Invalid credentials")
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new BadRequest("Invalid credentials")
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME || "30d" }
  )

  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  })
}

export { register, login }
