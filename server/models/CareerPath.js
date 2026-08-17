const mongoose = require('mongoose');

const RequiredSkillSchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  priority: {
    type: Number,
    default: 1, // Lower integer = higher priority
    min: 1
  },
  minimumLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  }
}, { _id: false });

const CareerPathSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Career path name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  requiredSkills: [RequiredSkillSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('CareerPath', CareerPathSchema);
