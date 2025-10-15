import { INTERNAL_SERVER_ERROR } from "http-status-codes"
import customAPIError from "../errors/custom-api.js"

const errorHandler = (err, req, res, next) => {
  if (err instanceof customAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res.status(INTERNAL_SERVER_ERROR).json({ msg: "something went wrong" })
}

export default errorHandler
