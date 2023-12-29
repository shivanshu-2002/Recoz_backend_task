const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userController = {
  // Signup controller
  signup: async (req, res) => {
    try {
      const { firstName, lastName, password, email, accountType } = req.body;

      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already registered.' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        password: hashedPassword,
        email,
        accountType,
        courses: []
      });

      const savedUser = await newUser.save();

      res.status(201).json({ success: true, user: savedUser });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Login controller
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
  
      if (await bcrypt.compare(password, user.password)) {
        const token = await jwt.sign(
          { email: user.email, id: user._id, role: user.accountType },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
           
          }
        )
  
        // Save token to user document in database
        user.token = token
        user.password = undefined
        // Set cookie for token and return success response
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: `User Login Success`,
        })
      } else {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        })
      }

  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
  


  // Delete user controller
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.userId;

      // Delete user by ID
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      res.status(200).json({ success: true, user: deletedUser });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Update user details controller
  updateUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const updatedFields = req.body;

      // Update user by ID
      const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Get user's courses controller
  getUserCourses: async (req, res) => {
    try {
      const userId = req.params.userId;

      // Find user by ID and populate the courses
      const user = await User.findById(userId).populate('courses');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      res.status(200).json({ success: true, courses: user.courses });
    } catch (error) {
      console.error('Get user courses error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
};

module.exports = userController;
