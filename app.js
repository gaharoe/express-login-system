import express from "express"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

import { auth, login, register } from "./utils/auth.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("./public"))


app.get("/register", (req, res) => {
    res.sendFile(__dirname+"/public/register.html")
})

app.get("/home", auth, (req, res) => {
    res.sendFile(__dirname+"/public/home.html")
})

app.post("/api/login", login, (req, res) => {
    res.cookie("token", req.token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        path: "/",
        secure: true
    })
    res.json({error: null})
})

app.post("/api/register", register, (req, res) => {
    res.json({error: 0})
})

app.get("/api/me", auth, (req, res) => {
    res.json(req.user)
})

app.get("/api/logout", (req, res) => {
    res.clearCookie("token", {path: "/"})
    res.json({error: null})
})

app.listen(80)