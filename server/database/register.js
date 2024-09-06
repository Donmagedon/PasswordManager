const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const express = require("express")
const route = express.Router()
const path = require("path")
const middlewares = require("./middleware")


route.post("/submit",middlewares.DBconnect,middlewares.createUser)
route.get("/",(req,res,next)=>{
    res.sendFile(path.join(__dirname,"../views/register.html"))
})

module.exports = route
