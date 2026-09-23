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
      enum: ['CSE', 'IT', 'CSE-AIML', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'],
      default: 'CSE'
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
