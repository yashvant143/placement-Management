const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretplacementjwtkey2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Student, HR, Admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, branch, passingYear, college } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const userRole = role || 'student';
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      phone: phone || ''
    });

    if (user) {
      // Create student profile automatically if role is student
      if (userRole === 'student') {
        await StudentProfile.create({
          userId: user._id,
          college: college || 'College of Engineering',
          branch: branch || 'CSE',
          passingYear: passingYear || 2027,
          cgpa: 0,
          skills: [],
          resumeUrl: ''
        });
      } else if (userRole === 'hr') {
        // Create company entry if role is hr
        await Company.create({
          userId: user._id,
          name: name ? `${name}'s Company` : 'Corporate HR',
          email: email,
          phone: phone || ''
        });
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let profileData = null;
    if (user.role === 'student') {
      profileData = await StudentProfile.findOne({ userId: user._id });
    } else if (user.role === 'hr') {
      profileData = await Company.findOne({ userId: user._id });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profile: profileData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
