const express = require('express');
const router = express.Router();

const courseController = require('../controller/Courses');
const { auth,isInstructor ,isStudent} = require("../middleware/auth");


// Create course route
router.post('/createCourse',auth,isInstructor, courseController.createCourse);

// Buy course route
router.post('/buy/:courseId',auth,isStudent, courseController.buyCourse);

// Delete course route
router.delete('/:courseId',auth,isInstructor, courseController.deleteCourse);

// Get course details route
router.get('/:courseId', courseController.getCourseDetails);
router.get('/courses', courseController.getAllCourses);

module.exports = router;
