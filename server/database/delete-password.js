const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const express = require("express")
const route = express.Router()
const path = require("path")
const middlewares = require("./middleware")


route.delete("/",middlewares.DBconnect,middlewares.deletePassword)
module.exports = route