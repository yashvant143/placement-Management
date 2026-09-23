const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');

// @desc    Get HR company profile
// @route   GET /api/companies/profile
// @access  Private (HR)
const getCompanyProfile = async (req, res) => {
  try {
    let company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      company = await Company.create({
        userId: req.user._id,
        name: req.user.name ? `${req.user.name}'s Organization` : 'Company Name',
        email: req.user.email
      });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update HR company profile
// @route   PUT /api/companies/profile
// @access  Private (HR)
const updateCompanyProfile = async (req, res) => {
  try {
    const { name, email, phone, website, location, description, industry } = req.body;

    let company = await Company.findOne({ userId: req.user._id });

    if (!company) {
      company = await Company.create({
        userId: req.user._id,
        name: name || 'Company Name',
        email: email || req.user.email,
        phone,
        website,
        location,
        description,
        industry
      });
    } else {
      company.name = name || company.name;
      company.email = email || company.email;
      company.phone = phone !== undefined ? phone : company.phone;
      company.website = website !== undefined ? website : company.website;
      company.location = location !== undefined ? location : company.location;
      company.description = description !== undefined ? description : company.description;
      company.industry = industry || company.industry;

      await company.save();
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get HR company metrics/dashboard
// @route   GET /api/companies/dashboard
// @access  Private (HR)
const getHRDashboardStats = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.json({
        totalJobs: 0,
        totalApplicants: 0,
        shortlisted: 0,
        selected: 0,
        interviewsScheduled: 0
      });
    }

    const companyJobs = await Job.find({ companyId: company._id });
    const jobIds = companyJobs.map(j => j._id);

    const totalApplicants = await Application.countDocuments({ jobId: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'Shortlisted' });
    const selected = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'Selected' });
    const interviewsScheduled = await Interview.countDocuments({ companyId: company._id });

    res.json({
      totalJobs: companyJobs.length,
      totalApplicants,
      shortlisted,
      selected,
      interviewsScheduled
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  getHRDashboardStats
};
