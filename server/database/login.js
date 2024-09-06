const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const express = require("express")
const route = express.Router()
const path = require("path")
const middlewares = require("./middleware")

route.post("/",middlewares.DBconnect,middlewares.loginAttempt,middlewares.tokenCreation)
route.post("/checkUser",middlewares.sessionSaved)
route.get("/",middlewares.sessionIsActive,(req,res,next)=>{
    res.sendFile(path.join(__dirname,"../views/login.html"))
})

module.exports = route