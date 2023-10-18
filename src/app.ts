import express from "express";
import { tasksRouter } from "./router/tasksRouter";
import { authRouter } from "./router/authRouter";
const app = express();
require("dotenv").config();

import passport from "passport";
// var LocalStrategy = require('passport-local');
import { Strategy as LocalStrategy } from "passport-local";
var session = require("express-session");
import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    //DB check
    const user = await prisma.user.findFirst({
      where: {
        email: username,
        password: password,
      },
    });

    //Callback
    return cb(null, user ? user : false);
  })
);

app.use(
  session({
    secret: "acbjkcvbmfdhshrnfhchsnelxfpdowmsabsgchd",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
  })
);

passport.serializeUser((user: Partial<User>, cb) => {
  return cb(null, user.id);
});

passport.deserializeUser(async (userId: number, cb) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  return cb(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.user);
  next();
});

app.use(authRouter);
app.use(tasksRouter);

app.listen(4000);
