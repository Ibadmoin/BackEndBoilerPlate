const express = require('express');
const stdRouter = express.Router();
const StudentController = require('../controller/studentController')


stdRouter.post("/register",StudentController.registerStudent)




module.exports = stdRouter;


