import { NOT_FOUND } from "http-status-codes"
import customAPIError from "./custom-api.js"

class notFound extends customAPIError {
  constructor(message) {
    super(message)
    this.statusCode = NOT_FOUND
  }
}

export default notFound
