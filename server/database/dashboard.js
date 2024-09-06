const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const express = require("express")
const route = express.Router()
const path = require("path")
const middlewares = require("./middleware")

route.get("/",middlewares.isAuthenticated,middlewares.sessionIsActive,(req,res,next)=>{
    res.sendFile(path.join(__dirname,"../views/dashboard.html"))
})

module.exports = route