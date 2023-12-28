const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true
    },
    courseDescription: {
        type: String,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    whatYouWillLearn: {
        type: String,
        trim: true
    },
    price: {
        type: Number
    },
    rating: {
        type: Number
    },
    tag: {
        type: [String],
        required: true,
    },
});

module.exports = mongoose.model("Course", courseSchema);