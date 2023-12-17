const express = require('express');
const stdRouter = express.Router();
const StudentController = require('../controller/studentController')


stdRouter.post("/register",StudentController.registerStudent);
stdRouter.post("/login",StudentController.login);
stdRouter.get("/students",StudentController.getAllStudent);




module.exports = stdRouter;


