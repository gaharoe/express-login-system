import jwt from "jsonwebtoken"
import fs from "fs"

const users = JSON.parse(fs.readFileSync("./data/users.json"))
const jwtSecret = "my name lala"

export function login(req, res, next){
    const {username, nama} = req.body
    const user = users.find(data => data.username == username && data.nama == nama)
    if(!user){
        res.json({error: 1})
        return
    }
    const token = jwt.sign({nama: user.nama, username: user.username}, jwtSecret, {expiresIn: "1d"})
    req.user = user
    req.token = token
    next()
}

export function auth(req, res, next){
    const token = req.cookies.token
    if(!token){
        res.redirect("/")
        return
    }
    const payload = jwt.verify(token, jwtSecret)
    if(payload){
        const user = users.find(data => data.username == payload.username)
        if(user){
            req.user = user
            next()
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("/")
    }
}

export function register(req, res, next){
    const {username, password, nama} = req.body
    const user = users.find(data => data.username == username)
    if(user){
        res.json({error: 1})
        return
    }
    users.push({username, password, nama})
    fs.writeFileSync("./data/users.json", JSON.stringify(users))
    next()
}