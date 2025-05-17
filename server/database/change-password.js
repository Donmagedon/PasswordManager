const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const express = require("express");
const route = express.Router();
const middlewares = require("./middleware");

route.patch("/", middlewares.DBconnect, middlewares.changePassword);


module.exports = route;