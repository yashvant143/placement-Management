const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    skills: {
      type: [String],
      default: []
    },
    minCGPA: {
      type: Number,
      required: true,
      default: 6.0
    },
    allowedBranches: {
      type: [String],
      default: ['CSE', 'IT', 'CSE-AIML', 'ECE']
    },
    passingYear: {
      type: Number,
      required: true,
      default: 2027
    },
    salary: {
      type: String,
      required: true,
      default: '6.0 LPA'
    },
    location: {
      type: String,
      required: true,
      default: 'Remote / Hybrid'
    },
    deadline: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
