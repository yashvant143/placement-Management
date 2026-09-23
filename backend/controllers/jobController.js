const Job = require('../models/Job');
const Company = require('../models/Company');
const StudentProfile = require('../models/StudentProfile');
const checkEligibility = require('../utils/eligibilityChecker');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new job drive
// @route   POST /api/jobs
// @access  Private (HR / Admin)
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      skills,
      minCGPA,
      allowedBranches,
      passingYear,
      salary,
      location,
      deadline
    } = req.body;

    let companyId = req.body.companyId;

    if (!companyId && req.user.role === 'hr') {
      const company = await Company.findOne({ userId: req.user._id });
      if (!company) {
        return res.status(400).json({ message: 'Please complete your HR Company Profile before posting a job.' });
      }
      companyId = company._id;
    }

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    const job = await Job.create({
      companyId,
      title,
      description,
      skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : [],
      minCGPA: Number(minCGPA) || 6.0,
      allowedBranches: Array.isArray(allowedBranches) ? allowedBranches : typeof allowedBranches === 'string' ? allowedBranches.split(',').map(b => b.trim()) : ['CSE', 'IT'],
      passingYear: Number(passingYear) || 2027,
      salary: salary || '6.0 LPA',
      location: location || 'Remote / Onsite',
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Notify all active students of new job drive
    const students = await User.find({ role: 'student' }).select('_id');
    const notifications = students.map(s => ({
      userId: s._id,
      title: 'New Placement Drive Posted',
      message: `A new placement drive "${job.title}" has been posted by your placement portal.`
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs (with search, filter, and eligibility scoring if student)
// @route   GET /api/jobs
// @access  Public / Private
const getJobs = async (req, res) => {
  try {
    const { search, location, minSalary, branch, skill, companyId } = req.query;

    let query = { status: 'Active' };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (branch) {
      query.allowedBranches = { $in: [branch] };
    }
    if (skill) {
      query.skills = { $in: [skill] };
    }
    if (companyId) {
      query.companyId = companyId;
    }

    const jobs = await Job.find(query).populate('companyId').sort({ createdAt: -1 });

    // If user is a student, attach eligibility calculations to each job
    let studentProfile = null;
    if (req.user && req.user.role === 'student') {
      studentProfile = await StudentProfile.findOne({ userId: req.user._id });
    }

    const enrichedJobs = jobs.map(job => {
      const jobObj = job.toObject();
      if (studentProfile) {
        const eligibility = checkEligibility(studentProfile, jobObj);
        jobObj.eligibility = eligibility;
      } else {
        jobObj.eligibility = { isEligible: true, reasons: [] };
      }
      return jobObj;
    });

    res.json(enrichedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public / Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('companyId');
    if (!job) {
      return res.status(404).json({ message: 'Job drive not found' });
    }

    const jobObj = job.toObject();

    if (req.user && req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
      if (studentProfile) {
        jobObj.eligibility = checkEligibility(studentProfile, jobObj);
      }
    }

    res.json(jobObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job drive
// @route   PUT /api/jobs/:id
// @access  Private (HR / Admin)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job drive
// @route   DELETE /api/jobs/:id
// @access  Private (HR / Admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.deleteOne();
    res.json({ message: 'Job drive removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
};
