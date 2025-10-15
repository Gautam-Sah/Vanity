import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"

const authMiddleware = async (req, res, next) => {
  // Check for authorization header
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Authentication invalid - No token provided",
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to request object
    req.user = {
      userId: payload.userId,
      email: payload.email,
    }

    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Authentication invalid - Token expired or invalid",
    })
  }
}

export default authMiddleware
