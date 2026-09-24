const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    college: {
      type: String,
      default: 'College of Engineering & Technology'
    },
    branch: {
  type: String,
  required: true,
  enum: [
    'CSE',
    'IT',
    'CSE-AIML',
    'ECE',
    'EEE',
    'MECH',
    'CIVIL',
    'OTHER',
    'COMPUTER SCIENCE'
  ],
  default: 'CSE',
  set: function(value) {
    if (!value) return value;

    const branch = value.trim().toLowerCase();

    const branchMap = {
      'cse': 'CSE',
      'computer science': 'COMPUTER SCIENCE',
      'computer science engineering': 'COMPUTER SCIENCE',
      'it': 'IT',
      'information technology': 'IT',
      'cse-aiml': 'CSE-AIML',
      'cse aiml': 'CSE-AIML',
      'computer science and artificial intelligence': 'CSE-AIML',
      'ece': 'ECE',
      'electronics and communication engineering': 'ECE',
      'eee': 'EEE',
      'electrical and electronics engineering': 'EEE',
      'mech': 'MECH',
      'mechanical engineering': 'MECH',
      'civil': 'CIVIL',
      'civil engineering': 'CIVIL'
    };

    return branchMap[branch] || 'OTHER';
  }
},
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 0.0
    },
    tenthPercentage: {
      type: Number,
      default: 0
    },
    twelfthPercentage: {
      type: Number,
      default: 0
    },
    passingYear: {
      type: Number,
      required: true,
      default: 2027
    },
    skills: {
      type: [String],
      default: []
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    projects: [
      {
        title: String,
        description: String,
        link: String
      }
    ],
    placementStatus: {
      type: String,
      enum: ['Unplaced', 'Placed'],
      default: 'Unplaced'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
