const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getStudentProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id }).populate('userId', 'name email phone');
    if (!profile) {
      // Create empty profile if not found
      profile = await StudentProfile.create({
        userId: req.user._id,
        branch: 'CSE',
        cgpa: 0,
        passingYear: 2027
      });
      profile = await StudentProfile.findById(profile._id).populate('userId', 'name email phone');
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateStudentProfile = async (req, res) => {
  try {
    const {
      branch,
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      passingYear,
      skills,
      projects,
      college,
      name,
      phone
    } = req.body;

    // Update user info
    if (name || phone) {
      await User.findByIdAndUpdate(req.user._id, {
        ...(name && { name }),
        ...(phone && { phone })
      });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });

    if (profile) {
      profile.branch = branch !== undefined ? branch : profile.branch;
      profile.cgpa = cgpa !== undefined ? Number(cgpa) : profile.cgpa;
      profile.tenthPercentage = tenthPercentage !== undefined ? Number(tenthPercentage) : profile.tenthPercentage;
      profile.twelfthPercentage = twelfthPercentage !== undefined ? Number(twelfthPercentage) : profile.twelfthPercentage;
      profile.passingYear = passingYear !== undefined ? Number(passingYear) : profile.passingYear;
      profile.skills = Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : profile.skills;
      profile.projects = projects || profile.projects;
      profile.college = college || profile.college;

      const updatedProfile = await profile.save();
      return res.json(updatedProfile);
    } else {
      const newProfile = await StudentProfile.create({
        userId: req.user._id,
        college: college || 'College of Engineering',
        branch: branch || 'CSE',
        cgpa: cgpa || 0,
        tenthPercentage: tenthPercentage || 0,
        twelfthPercentage: twelfthPercentage || 0,
        passingYear: passingYear || 2027,
        skills: Array.isArray(skills) ? skills : [],
        projects: projects || []
      });
      return res.status(201).json(newProfile);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload student resume
// @route   POST /api/students/resume
// @access  Private (Student)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file' });
    }

    let resumeUrl = `/uploads/${req.file.filename}`;

    // Try Cloudinary upload if configured with valid credentials
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== '1234567890') {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'raw',
          folder: 'placement_resumes'
        });
        resumeUrl = result.secure_url;
      } catch (cErr) {
        console.warn('Cloudinary upload warning, using local file path:', cErr.message);
      }
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { resumeUrl },
      { new: true, upsert: true }
    );

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl,
      profile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student applications
// @route   GET /api/students/applications
// @access  Private (Student)
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' }
      })
      .populate('companyId')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student interview schedules
// @route   GET /api/students/interviews
// @access  Private (Student)
const getStudentInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ studentId: req.user._id })
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

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  getStudentApplications,
  getStudentInterviews
};
