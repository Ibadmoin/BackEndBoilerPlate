require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../model/productModel');
const Student = require('../model/stdModel');
const fs = require('fs').promises;
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Images paths should be in assets/images
// make sure to upload png images
// cd utils then node bulkScript.js


cloudinary.config({ 
    cloud_name: 'dfhvlndon', 
    api_key: process.env.CLOUDNARY_KEY, 
    api_secret: process.env.CLOUDNARY_SECRET 
});

// Define the CloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Student', // optional, if you want to organize uploads in Cloudinary
        format: async (req, file) => 'png', // file format (you can change it as needed)
        public_id: (req, file) => `${file.originalname}-${Date.now()}`, // unique identifier for each file
    },
});

// Configure multer without using upload.single('image')
const upload = multer({
    storage: storage,
}).single('image');

async function bulkUpload() {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        const data = await fs.readFile('./product.json', 'utf8');
        const jsonData = JSON.parse(data);
        const user = jsonData.user;

        // Loop through products and save them to the database
        for (const userdata of user) {
            const { name, email, password, phone, profilePicture, course } = userdata;

            try {
                try{
                    const cloudinaryResponse = await cloudinary.uploader.upload(profilePicture, {
                        folder: 'Student',
                        public_id: `${name}-${Date.now()}`,
                    });
                }catch(e){
                    console.log(e);
                }
                

                const newStudent = new Student({
                    name,
                    email,
                    phone,
                    password,
                    course,
                    profilePicture: cloudinaryResponse.secure_url || "empty url",
                });

                await newStudent.save();
                console.log(`Student "${name}" uploaded successfully.`);
            } catch (err) {
                console.error('Error processing product:', err);
            }
        }

        console.log('Bulk upload completed.');
    } catch (err) {
        console.error('Error uploading products:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        console.log(process.env.MONGO_URI);
    }
}

bulkUpload();
