"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksRouter = void 0;
const tasksController_1 = require("../controllers/tasksController");
const express = require("express");
const tasksRouter = express.Router();
exports.tasksRouter = tasksRouter;
tasksRouter.get("/api/v1/tasks", tasksController_1.getAllTasks);
tasksRouter.get("/api/v1/tasks/:id", tasksController_1.getTask);
tasksRouter.post("/api/v1/tasks", tasksController_1.createTask);
tasksRouter.post("/api/v1/tasks/:id", tasksController_1.editTask);
