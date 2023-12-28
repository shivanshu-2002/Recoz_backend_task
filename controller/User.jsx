const User = require('../models/User');
const bcrypt = require('bcrypt');

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
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect password.' });
      }

      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        })

      user.token = token;
      user.password = undefined;

      const options = {
        maxAge: 3 * 24 * 60 * 60 * 1000, // Set the cookie to expire in 3 days (3 * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
        httpOnly: true,
      };

      // save it in a cookie and send the response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged In Successfully",
      });

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
