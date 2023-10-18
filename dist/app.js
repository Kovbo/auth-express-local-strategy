"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tasksRouter_1 = require("./router/tasksRouter");
const authRouter_1 = require("./router/authRouter");
const app = (0, express_1.default)();
require("dotenv").config();
const passport_1 = __importDefault(require("passport"));
// var LocalStrategy = require('passport-local');
const passport_local_1 = require("passport-local");
var session = require("express-session");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
passport_1.default.use(new passport_local_1.Strategy(async (username, password, cb) => {
    //DB check
    const user = await prisma.user.findFirst({
        where: {
            email: username,
            password: password,
        },
    });
    //Callback
    return cb(null, user ? user : false);
}));
app.use(session({
    secret: "acbjkcvbmfdhshrnfhchsnelxfpdowmsabsgchd",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
}));
passport_1.default.serializeUser((user, cb) => {
    return cb(null, user.id);
});
passport_1.default.deserializeUser(async (userId, cb) => {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });
    return cb(null, user);
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.user);
    next();
});
app.use(authRouter_1.authRouter);
app.use(tasksRouter_1.tasksRouter);
app.listen(4000);
