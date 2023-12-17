const Student = require("../model/stdModal.js")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const chalk = require('chalk');
const jwt = require('../utils/jwt')


// Password validation schema Through joi
const passwordValidation = Joi.string()
  .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}":;<>,.?~\\-]).{8,}$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long.',
    'any.required': 'Password is required.',
  });

  // Define schema for user login

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().required()
});

// Password update schema

const validatePasswords = Joi.object({
    newPassword : passwordValidation,
    confirmPassword: passwordValidation,
    email: Joi.string().email().required()
});


// Update user Joi Schema

const updateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password:passwordValidation,
    phone: Joi.string()
}).or('name', "email",'password','phone');


const StudentController = {
    
}



