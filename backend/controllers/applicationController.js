const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');
const Notification = require('../models/Notification');
const checkEligibility = require('../utils/eligibilityChecker');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Student)
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check existing application
    const existingApp = await Application.findOne({
      studentId: req.user._id,
      jobId
    });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this placement drive' });
    }

    // Verify Eligibility
    const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
    if (!studentProfile) {
      return res.status(400).json({ message: 'Please complete your student profile before applying.' });
    }

    const eligibility = checkEligibility(studentProfile, job);
    if (!eligibility.isEligible) {
      return res.status(400).json({
        message: 'You are not eligible for this job drive.',
        reasons: eligibility.reasons
      });
    }

    const application = await Application.create({
      studentId: req.user._id,
      jobId: job._id,
      companyId: job.companyId,
      status: 'Applied'
    });

    // Send confirmation notification
    await Notification.create({
      userId: req.user._id,
      title: 'Application Submitted',
      message: `Your application for "${job.title}" has been submitted successfully.`
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications (filtered by companyId for HR, or all for Admin)
// @route   GET /api/applications
// @access  Private (HR / Admin)
const getApplications = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'hr') {
      const company = await Company.findOne({ userId: req.user._id });
      if (company) {
        filter.companyId = company._id;
      }
    }

    if (req.query.jobId) filter.jobId = req.query.jobId;
    if (req.query.status) filter.status = req.query.status;

    const applications = await Application.find(filter)
      .populate('studentId', 'name email phone')
      .populate('jobId')
      .populate('companyId')
      .sort({ createdAt: -1 });

    // Attach student profile info (cgpa, branch, skills, resume)
    const enrichedApps = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        if (app.studentId) {
          const profile = await StudentProfile.findOne({ userId: app.studentId._id });
          appObj.studentProfile = profile;
        }
        return appObj;
      })
    );

    res.json(enrichedApps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Shortlist, Reject, Select)
// @route   PUT /api/applications/:id/status
// @access  Private (HR / Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('studentId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    // If selected, update student profile placement status
    if (status === 'Selected') {
      await StudentProfile.findOneAndUpdate(
        { userId: application.studentId._id },
        { placementStatus: 'Placed' }
      );
    }

    // Create Notification for Student
    await Notification.create({
      userId: application.studentId._id,
      title: `Application Status Updated: ${status}`,
      message: `Your application status for "${application.jobId.title}" has been updated to "${status}".`
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForJob,
  getApplications,
  updateApplicationStatus
};
