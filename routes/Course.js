const express = require('express');
const router = express.Router();

const courseController = require('../controller/Courses');
const { auth,isInstructor ,isStudent} = require("../middleware/auth");


// Create course route
router.post('/createCourse',auth,isInstructor, courseController.createCourse);

// Buy course route
router.post('/buy/:courseId',auth,isStudent, courseController.buyCourse);

// Delete course route

// Get course details route
router.get('/:courseId', courseController.courseDetail);
router.get('/', courseController.getAllCourses);

module.exports = router;
