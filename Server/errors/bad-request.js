import CustomAPIError from "./custom-api.js"
import { StatusCodes } from "http-status-codes"
class BadRequest extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST || 400
  }
}

export default BadRequest
