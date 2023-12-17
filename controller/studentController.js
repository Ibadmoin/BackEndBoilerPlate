const Student = require("../model/stdModel")
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
    phone: Joi.string(),
    course : Joi.string()
}).or('name', "email",'password','phone');


const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: passwordValidation,
  course:Joi.string().required(),
  phone: Joi.string().required(),
  imgUrl: Joi.string().required(),
});

const StudentController = {

      async registerStudent(req,res){

        try{
          
        const {error}= signupSchema.validate(req.body);
        if(error){
          return res.status(200).json({messages:error.details[0].message});
        }
        //getting const from body
        const {name, email, phone, course,password, imgUrl }= req.body;
        const existingStudent = await Student.findOne({email});
        if(existingStudent){
          return res.status(400).json({message: "Email already exists"});
        } 

         // hashig the password
         const hashedPass = await bcrypt.hash(password,10);
            // Creating new user in database
            const newStudent = new Student({
              name,
              email, 
              password: hashedPass,
              phone,
              imgUrl,
              course
          });
          
          const token = jwt.sign(email);

          
            // Save the user in the database
            const student = await newStudent.save();
            return res.status(200).json({message:"Student registered successfully.",student, token})

        }catch(err){
          return res.status(500).json({message:"Internal server error."})
        }


      },

       // Login Req
    async login(req,res){
      try{

          // Validating the req body using the login schema
          const {error} = loginSchema.validate(req.body);

          if(error){
              return res.status(400).json({message: error.details[0].message});
          }

          const {email, password}= req.body
          // Find the user  by email
          const student = await Student.findOne({email});

          if(!student){
              return res.status(400).json({message:"Invalid email or password"});
          }

          // Comparing provided Password with Stored hashed password
          console.log(user.password)

          const isPasswordValid = await bcrypt.compare(password, student.password);
          console.log(chalk.red(isPasswordValid))
          if(!isPasswordValid){
              return res.status(400).json({message:"Invalid Password"})
          }

          // generating a JWt token and set is as a cookie
          const token = jwt.sign(email);

          // Successfully login status
          return res.status(200).json({message: "Login Successfully.",user,token})



      }catch(err){
          res.status(500).json({message: "Internal server error.", error: err.message});
      }
  },

  
    
}






module.exports = StudentController;