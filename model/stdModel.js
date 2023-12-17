const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    profilePicture:{type: String},
    course: {type:String, required: true},
    imgUrl: {type:String, required:true},
    registrationDate: { type: Date, default: Date.now },

    //refference
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],

})


module.exports = mongoose.model("Student", StudentSchema)