const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Company = require('../models/Company');
const Notification = require('../models/Notification');
const Job = require('../models/Job');

// @desc    Schedule interview round
// @route   POST /api/interviews
// @access  Private (HR / Admin)
const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, date, time, mode, meetingLink, round, notes } = req.body;

    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const interview = await Interview.create({
      applicationId: application._id,
      studentId: application.studentId,
      companyId: application.companyId,
      date,
      time,
      mode: mode || 'Online',
      meetingLink: meetingLink || '',
      round: round || 'Technical Interview',
      notes: notes || ''
    });

    // Automatically update application status to 'Interview'
    application.status = 'Interview';
    await application.save();

    // Create Notification for Student
    await Notification.create({
      userId: application.studentId,
      title: 'Interview Scheduled 🗓️',
      message: `An interview for round "${interview.round}" has been scheduled on ${interview.date} at ${interview.time}. Mode: ${interview.mode}`
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interview list
// @route   GET /api/interviews
// @access  Private (HR / Admin / Student)
const getInterviews = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    } else if (req.user.role === 'hr') {
      const company = await Company.findOne({ userId: req.user._id });
      if (company) {
        query.companyId = company._id;
      }
    }

    const interviews = await Interview.find(query)
      .populate('studentId', 'name email phone')
      .populate('companyId')
      .populate({
        path: 'applicationId',
        populate: { path: 'jobId' }
      })
      .sort({ date: 1 });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview details
// @route   PUT /api/interviews/:id
// @access  Private (HR / Admin)
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview schedule not found' });

    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scheduleInterview,
  getInterviews,
  updateInterview
};
