const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['video', 'article', 'docs', 'course'], default: 'article' }
}, { _id: false });

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Core Engineering', 'Security'],
    default: 'Frontend'
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  estimatedHours: {
    type: Number,
    required: true,
    min: 1
  },
  resources: [ResourceSchema],
  miniTask: {
    title: { type: String, default: 'Practice mini-task' },
    description: { type: String, default: 'Build a quick sample component or algorithm.' },
    instructions: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', SkillSchema);
