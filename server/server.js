const express = require("express");
const app = express();
const register = require("./database/register");
const login = require("./database/login");
const index = require("./database/index");
const dashboard = require("./database/dashboard");
const createPassword = require("./database/create-password");
const passwordCreated = require("./database/password-created");
const searchPassword = require("./database/search-password");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { sessionSaved } = require("./database/middleware");
const middlewares = require("./database/middleware");
const userPasswords = require("./database/user-passwords");
const options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html"],
  index: false,
  maxAge: "1d",
  redirect: false,
  setHeaders(res, path, stat) {
    res.set("x-timestamp", Date.now());
  },
};

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public", options));
app.use("/login", login);
app.use("/login.html", login);
app.use("/index", index);
app.use("/index.html", index);
app.use("/register", register);
app.use("/register.html", register);
app.use("/dashboard", dashboard);
app.use("/dashboard.html", dashboard);
app.use("/create-password.html", createPassword);
app.use("/create-password", createPassword);
app.use("/user-passwords", userPasswords);
app.use("/password-created", passwordCreated);
app.use("/password-created.html", passwordCreated);
app.use("/search-password", searchPassword);
app.use("/delete-password", userPasswords);

app.listen(3330, "0.0.0.0", () => {
  console.log("server is now listening!");
});
