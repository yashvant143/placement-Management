const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get complete admin placement statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin)
const getAdminStatistics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });
    const interviewCount = await Application.countDocuments({ status: 'Interview' });
    const selectedCount = await Application.countDocuments({ status: 'Selected' });
    const rejectedCount = await Application.countDocuments({ status: 'Rejected' });
    const appliedCount = await Application.countDocuments({ status: 'Applied' });

    // Placement status breakdown
    const placedStudents = await StudentProfile.countDocuments({ placementStatus: 'Placed' });
    const unplacedStudents = totalStudents - placedStudents;

    // Branch-wise placements
    const branches = ['CSE', 'IT', 'CSE-AIML', 'ECE', 'EEE', 'MECH', 'CIVIL'];
    const branchStats = await Promise.all(
      branches.map(async (branch) => {
        const totalInBranch = await StudentProfile.countDocuments({ branch });
        const placedInBranch = await StudentProfile.countDocuments({ branch, placementStatus: 'Placed' });
        return {
          branch,
          total: totalInBranch,
          placed: placedInBranch,
          placementRate: totalInBranch > 0 ? Math.round((placedInBranch / totalInBranch) * 100) : 0
        };
      })
    );

    // Application Funnel Chart Data
    const funnelData = [
      { stage: 'Applied', count: appliedCount + shortlistedCount + interviewCount + selectedCount + rejectedCount },
      { stage: 'Shortlisted', count: shortlistedCount + interviewCount + selectedCount },
      { stage: 'Interview', count: interviewCount + selectedCount },
      { stage: 'Selected', count: selectedCount }
    ];

    // Company-wise placements
    const companies = await Company.find().select('name');
    const companyStats = await Promise.all(
      companies.map(async (c) => {
        const selections = await Application.countDocuments({ companyId: c._id, status: 'Selected' });
        return {
          company: c.name,
          selections
        };
      })
    );

    res.json({
      summary: {
        totalStudents,
        totalCompanies,
        totalJobs,
        totalApplications,
        shortlistedCount,
        interviewCount,
        selectedCount,
        rejectedCount,
        placedStudents,
        unplacedStudents,
        placementPercentage: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0
      },
      branchStats,
      funnelData,
      companyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students with profile info
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const studentProfiles = await Promise.all(
      students.map(async (student) => {
        const profile = await StudentProfile.findOne({ userId: student._id });
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          profile: profile || {}
        };
      })
    );

    res.json(studentProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered companies
// @route   GET /api/admin/companies
// @access  Private (Admin)
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('userId', 'name email phone');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStatistics,
  getAllStudents,
  getAllCompanies
};
