const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
