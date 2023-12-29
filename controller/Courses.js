const Course = require('../models/Course');
const User = require('../models/User');

const courseController = {
  // Buy course controller
  buyCourse: async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const userId = req.user.id;

      // Find the course
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      // Find the user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // Check if the user already owns the course
      if (user.courses.includes(courseId)) {
        return res.status(400).json({ success: false, message: 'User already owns this course.' });
      }

      // Add the course to the user's courses
      user.courses.push(courseId);
      await user.save();

      res.status(200).json({ success: true, message: 'Course bought successfully.' });
    } catch (error) {
      console.error('Buy course error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
  createCourse: async (req, res) => {
    try {
      const { courseName, courseDescription, instructor, whatYouWillLearn, price, rating, tag } = req.body;

      const newCourse = new Course({
        courseName,
        courseDescription,
        instructor,
        whatYouWillLearn,
        price,
        rating,
        tag,
      });

      const savedCourse = await newCourse.save();

      // Update the user's courses
      const instructorUser = await User.findById(instructor);

      if (!instructorUser) {
        return res.status(404).json({ success: false, message: 'Instructor not found.' });
      }

      instructorUser.courses.push(savedCourse._id);
      await instructorUser.save();

      res.status(201).json({ success: true, course: savedCourse });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
  courseDetail: async (req, res) => {
    try {
      const courseId = req.params.courseId;

      // Find the course by ID
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }

      // Return course details
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      console.error('Course detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },
  getAllCourses: async (req, res) => {
    try {
      // Find all courses
      const courses = await Course.find();

      res.status(200).json({ success: true, courses });
    } catch (error) {
      console.error('Get all courses error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
  // Delete course controller
  deleteCourse: async (req, res) => {
    try {
      const courseId = req.params.courseId;

      // Find the course
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      // Delete the course by ID
      const deletedCourse = await Course.findByIdAndDelete(courseId);

      if (!deletedCourse) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }

      // Remove the course from all users who own it
      await User.updateMany({ courses: courseId }, { $pull: { courses: courseId } });

      res.status(200).json({ success: true, course: deletedCourse });
    } catch (error) {
      console.error('Delete course error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
};

module.exports = courseController;
