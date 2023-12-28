const express = require('express');
const router = express.Router();
const userController = require('../controller/User');
const { auth } = require("../middleware/auth")

// Signup route
router.post('/signup', userController.signup);

// Login route
router.post('/login', userController.login);

// Delete user route
router.delete('/:userId', auth, userController.deleteUser);

// Update user details route
router.put('/:userId', auth, userController.updateUser);

// Get user courses route
router.get('/:userId/courses', auth, userController.getUserCourses);

module.exports = router;
