const mongoose = require('mongoose');

const UserSkillSchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Known', 'Developing', 'Missing'],
    default: 'Missing'
  }
}, { _id: false });

const ActivityLogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['assessment', 'progress', 'project', 'profile'], default: 'progress' },
  scoreImpact: { type: String, default: '+0%' },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  // Basic Academic Info
  branch: {
    type: String,
    default: 'Computer Science'
  },
  year: {
    type: String,
    default: '3rd Year'
  },
  collegeName: {
    type: String,
    default: 'Institute of Engineering & Technology',
    trim: true
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: 8.5
  },
  graduationYear: {
    type: Number,
    default: 2027
  },
  // Social & Portfolio Links
  githubUrl: {
    type: String,
    default: '',
    trim: true
  },
  linkedinUrl: {
    type: String,
    default: '',
    trim: true
  },
  portfolioUrl: {
    type: String,
    default: '',
    trim: true
  },
  // Placement Goals & Preferences
  targetCareer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerPath',
    default: null
  },
  targetCompanies: [{
    type: String,
    trim: true
  }],
  preferredRoles: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    default: 'Aspiring Full-Stack Software Engineer passionate about building scalable web products.',
    trim: true
  },
  weeklyStudyHours: {
    type: Number,
    default: 10,
    min: 1,
    max: 60
  },
  learningPreference: {
    type: String,
    enum: ['visual', 'hands-on', 'reading', 'balanced'],
    default: 'hands-on'
  },
  hasCompletedAssessment: {
    type: Boolean,
    default: false
  },
  skills: [UserSkillSchema],
  completedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  activities: [ActivityLogSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
