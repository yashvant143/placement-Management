const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    industry: {
      type: String,
      default: 'IT & Software'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
