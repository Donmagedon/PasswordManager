require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const users = require("./models/user");
const passwordObject = require("./models/password-object");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
function formattedTime() {
  let dateInstance = new Date();
  let current = `${dateInstance.getFullYear()}/${
    dateInstance.getMonth() + 1
  }/${dateInstance.getDate()}/${dateInstance.getHours()}:${dateInstance.getMinutes()}`;
  return current;
}
async function DBconnect(req, res, next) {
  const URI = `mongodb+srv://donmagedon7:${process.env.DB_PASSWORD}@cluster0.lnwbnuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  await mongoose.connect(URI, { dbName: "PasswordManager" });
  next();
}
async function createUser(req, res) {
  const timestamp = formattedTime;
  const passwordSalt = await bcrypt.genSalt(15);
  const hashedPassword = bcrypt.hash(req.body.password, passwordSalt);

  await users.create({
    username: req.body.username,
    password: await hashedPassword,
    timestamp: timestamp(),
  });
  res.sendStatus(200);
}
async function loginAttempt(req, res, next) {
  const savedPassword = await users.findOne({ username: req.body.username });
  try {
    const validation = bcrypt.compare(
      req.body.password,
      savedPassword.password
    );
    if (await validation) {
      next();
    } else {
      res.json(await validation);
    }
  } catch {
    await res.json(false);
  }
}
async function tokenCreation(req, res, next) {
  const key = fs.readFileSync(
    path.join(__dirname, "../../certificates/private.key")
  );
  const tokenLate = JWT.sign({ username: req.body.username }, key, {
    algorithm: "RS256",
    expiresIn: "3d",
  });
  const tokenEarly = JWT.sign(
    {
      username: req.body.username,
      password: req.body.password,
    },
    key,
    { algorithm: "RS256", expiresIn: "3h" }
  );
  res.json({ tokenEarly, tokenLate });
}

async function sessionSaved(req, res) {
  const key = fs.readFileSync(
    path.join(__dirname, "../../certificates/public.key")
  );
  JWT.verify(req.body.token, key, (err, payload) => {
    if (err) {
      res.sendStatus(401);
    } else {
      res.json(payload);
    }
  });
}

async function isAuthenticated(req, res, next) {
  const cookies = req.cookies;
  const key = fs.readFileSync(
    path.join(__dirname, "../../certificates/public.key")
  );
  if (!cookies.tokenEarly && !cookies.tokenLate) {
    res.redirect("/login.html");
  } else {
    try {
      JWT.verify(cookies.tokenEarly, key, (err, payload) => {
        if (err) {
          throw new Error(err);
        } else {
          next();
        }
      });
    } catch {
      try {
        JWT.verify(cookies.tokenLate, key, (err, payload) => {
          if (err) {
            res.redirect("/login.html");
          } else {
            next();
          }
        });
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}
async function sessionIsActive(req, res, next) {
  const cookies = req.cookies;
  const key = fs.readFileSync(
    path.join(__dirname, "../../certificates/public.key")
  );

  if (!cookies.tokenLate && !cookies.tokenLate) {
    if (req.baseUrl === "/login.html") {
      next();
    } else {
      res.redirect("/login.html");
    }
  } else {
    try {
      JWT.verify(cookies.tokenEarly, key, (err) => {
        if (err) {
          if (req.baseUrl === "/index.html") {
            next();
          } else {
            res.redirect("/index.html");
          }
        } else {
          if (req.baseUrl === "/index.html" || req.baseUrl === "/login.html") {
            res.redirect("/dashboard.html");
          } else {
            next();
          }
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
async function createPassword(req, res, next) {
  const encrypt = function (password) {
    const public = fs.readFileSync(
      path.join(__dirname, "../../certificates/public.key")
    );
    const encrypted = crypto.publicEncrypt(public, Buffer.from(password));
    return encrypted.toString("base64");
  };
  const metadata = {
    owner: req.body.username,
    creationDate: new Date(),
    creationDateFormatted: formattedTime(),
    hasChanged: false,
    timesChanged: 0,
  };
  const passwordData = {
    title: req.body.title,
    source: req.body.source,
    userId: req.body.userId,
    category: req.body.category,
    password: encrypt(req.body.password),
    description: req.body.description ? req.body.description : null,
    specialChar: req.body.specialChar ? req.body.specialChar : null,
    creationDate: req.body.creationDate ? req.body.creationDate : null,
    expiryDate: req.body.expiryDate ? req.body.expiryDate : null,
  };

  try {
    const titleExists = await passwordObject.findOne({
      title: passwordData.title,
    });
    if (titleExists) {
      res.sendStatus(400);
    } else {
      await passwordObject.create({
        title: passwordData.title,
        source: passwordData.source,
        userId: passwordData.userId,
        category: passwordData.category,
        password: passwordData.password,
        description: passwordData.description,
        specialChar: passwordData.specialChar,
        creationDate: passwordData.creationDate,
        expiryDate: passwordData.expiryDate,
        medatada: metadata,
      });
      res.sendStatus(200);
    }
  } catch (err) {
    res.sendStatus(400);
  }
  res.end();
}
async function decryptPassword(input) {
  const private = fs.readFileSync(
    path.join(__dirname, "../../certificates/private.key")
  );
  const decrypted = crypto.privateDecrypt(
    private,
    Buffer.from(input, "base64")
  );
  return decrypted.toString("utf-8");
}
async function deletePassword(req, res, next) {
  const object = req.body.title;
  const username = req.body.username;
  try {
    const storedPassword = await passwordObject.find({
      "medatada.owner": username,
    });
    if (storedPassword) {
      await passwordObject.deleteOne({
        title: object,
        "medatada.owner": username,
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
  }
}
async function searchPasswords(req, res, next) {
  const query = req.body.search;
  const user = req.body.username;
  const sendDecrypted = async function (response) {
    for (let i = 0; i < response.length; i++) {
      response[i].password = await decryptPassword(response[i].password);
    }
    return response;
  };
  try {
    let response = await passwordObject.find({
      $or: [
        { userId: { $regex: query,$options:"i" } },
        { title: { $regex: query, $options:"i" } },
        { source: { $regex:query, $options:"i"} },
      ],
      $and: [{ "medatada.owner": user }],
    });

    res.json(await sendDecrypted(response));
  } catch (error) {
    console.error(error);
  }
}
const middlewares = {
  DBconnect,
  createUser,
  isAuthenticated,
  tokenCreation,
  sessionSaved,
  sessionIsActive,
  loginAttempt,
  createPassword,
  deletePassword,
  searchPasswords,
};

module.exports = middlewares;
