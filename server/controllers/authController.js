const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CareerPath = require('../models/CareerPath');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'engipath_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new student or admin
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { 
      name, email, password, role, branch, year, collegeName, cgpa, graduationYear,
      targetCareer, weeklyStudyHours, learningPreference, targetCompanies, preferredRoles, bio 
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Default target career if not provided
    let selectedCareer = targetCareer;
    if (!selectedCareer) {
      const defaultCareer = await CareerPath.findOne({ name: /Full-Stack/i });
      if (defaultCareer) {
        selectedCareer = defaultCareer._id;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role === 'admin' ? 'admin' : 'student',
      branch: branch || 'Computer Science',
      year: year || '3rd Year',
      collegeName: collegeName || 'Institute of Engineering & Technology',
      cgpa: Number(cgpa) || 8.5,
      graduationYear: Number(graduationYear) || 2027,
      targetCareer: selectedCareer,
      weeklyStudyHours: Number(weeklyStudyHours) || 10,
      learningPreference: learningPreference || 'hands-on',
      bio: bio || 'Aspiring Software Engineer passionate about full-stack systems.',
      targetCompanies: Array.isArray(targetCompanies) ? targetCompanies : ['Google', 'Microsoft', 'Amazon'],
      preferredRoles: Array.isArray(preferredRoles) ? preferredRoles : ['Full-Stack Developer', 'Frontend Engineer'],
      skills: []
    });

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: userObj
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash').populate('targetCareer');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.json({
      success: true,
      token: generateToken(user._id),
      user: userObj
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser };
