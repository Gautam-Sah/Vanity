import express from "express"
const Router = express.Router()
import { register, login } from "../controllers/auth.js"

Router.post("/register", register)
Router.post("/login", login)

export default Router
