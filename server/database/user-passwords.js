const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const express = require("express")
const route = express.Router()
const middlewares = require("./middleware")

route.post("/",middlewares.DBconnect,middlewares.createPassword)
route.delete("/",middlewares.DBconnect,middlewares.deletePassword)
module.exports = route