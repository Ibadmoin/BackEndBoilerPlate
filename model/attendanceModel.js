
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    checkOutTime:{
        type:Date,
        default: null,

    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'absent',
    },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
