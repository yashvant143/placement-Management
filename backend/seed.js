const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Interview = require('./models/Interview');
const Notification = require('./models/Notification');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_system');
    console.log('Clearing existing data...');

    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Interview.deleteMany({});
    await Notification.deleteMany({});

    console.log('Creating Admin account...');
    const admin = await User.create({
      name: 'System Admin (TPO)',
      email: 'admin@placement.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210'
    });

    console.log('Creating HR accounts and Companies...');
    const hr1User = await User.create({
      name: 'Sarah Connor',
      email: 'hr@google.com',
      password: 'hr1234',
      role: 'hr',
      phone: '+91 9123456789'
    });

    const company1 = await Company.create({
      userId: hr1User._id,
      name: 'Google LLC',
      email: 'careers@google.com',
      phone: '+1 650-253-0000',
      website: 'https://google.com/careers',
      location: 'Bangalore / Remote',
      description: 'Global tech leader building world-class cloud, search, and AI software.',
      industry: 'Internet & Cloud'
    });

    const hr2User = await User.create({
      name: 'Satya Nadella HR',
      email: 'hr@microsoft.com',
      password: 'hr1234',
      role: 'hr',
      phone: '+91 9234567890'
    });

    const company2 = await Company.create({
      userId: hr2User._id,
      name: 'Microsoft Corporation',
      email: 'recruitment@microsoft.com',
      phone: '+1 425-882-8080',
      website: 'https://careers.microsoft.com',
      location: 'Hyderabad / Redmon',
      description: 'Empowering every person and organization on the planet to achieve more.',
      industry: 'Software & Cloud'
    });

    console.log('Creating Student accounts and Profiles...');
    // Student 1 (High CGPA - Eligible for all)
    const s1User = await User.create({
      name: 'Rahul Sharma',
      email: 'student1@college.edu',
      password: 'student123',
      role: 'student',
      phone: '+91 9988776655'
    });

    const s1Profile = await StudentProfile.create({
      userId: s1User._id,
      college: 'Institute of Technology & Science',
      branch: 'CSE',
      cgpa: 8.5,
      tenthPercentage: 92.4,
      twelfthPercentage: 88.6,
      passingYear: 2027,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
      resumeUrl: '',
      projects: [
        {
          title: 'E-Commerce Platform',
          description: 'Built with React, Express and Node.js with Stripe payments',
          link: 'https://github.com/example/ecommerce'
        }
      ]
    });

    // Student 2 (Moderate CGPA - Partially Eligible)
    const s2User = await User.create({
      name: 'Ananya Verma',
      email: 'student2@college.edu',
      password: 'student123',
      role: 'student',
      phone: '+91 9876501234'
    });

    const s2Profile = await StudentProfile.create({
      userId: s2User._id,
      college: 'Institute of Technology & Science',
      branch: 'ECE',
      cgpa: 6.2,
      tenthPercentage: 81.0,
      twelfthPercentage: 76.5,
      passingYear: 2027,
      skills: ['C++', 'Embedded C', 'Python', 'SQL'],
      resumeUrl: '',
      projects: [
        {
          title: 'IoT Weather Station',
          description: 'Raspberry Pi temperature monitor with web dashboard',
          link: 'https://github.com/example/iot-weather'
        }
      ]
    });

    // Student 3 (High CGPA - Placed)
    const s3User = await User.create({
      name: 'Aman Deep',
      email: 'student3@college.edu',
      password: 'student123',
      role: 'student',
      phone: '+91 9765432109'
    });

    const s3Profile = await StudentProfile.create({
      userId: s3User._id,
      college: 'Institute of Technology & Science',
      branch: 'IT',
      cgpa: 9.1,
      tenthPercentage: 95.0,
      twelfthPercentage: 91.2,
      passingYear: 2027,
      skills: ['Java', 'Spring Boot', 'AWS', 'Docker', 'Kubernetes'],
      resumeUrl: '',
      placementStatus: 'Placed',
      projects: [
        {
          title: 'Microservices Gateway',
          description: 'Distributed auth and API rate limiter',
          link: 'https://github.com/example/microservice-gateway'
        }
      ]
    });

    console.log('Creating Job Drives...');
    const job1 = await Job.create({
      companyId: company1._id,
      title: 'MERN Stack Developer',
      description: 'Looking for a passionate Full-Stack MERN developer to build scalable cloud microservices.',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      minCGPA: 6.5,
      allowedBranches: ['CSE', 'IT', 'CSE-AIML'],
      passingYear: 2027,
      salary: '12.0 LPA',
      location: 'Bangalore',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    });

    const job2 = await Job.create({
      companyId: company2._id,
      title: 'Associate Software Engineer',
      description: 'Join Microsoft Cloud & AI team. Development of backend C# / Java platform systems.',
      skills: ['C++', 'Java', 'Data Structures', 'SQL'],
      minCGPA: 7.0,
      allowedBranches: ['CSE', 'IT', 'CSE-AIML', 'ECE'],
      passingYear: 2027,
      salary: '16.5 LPA',
      location: 'Hyderabad',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    });

    console.log('Creating Applications & Interviews...');
    const app1 = await Application.create({
      studentId: s1User._id,
      jobId: job1._id,
      companyId: company1._id,
      status: 'Shortlisted'
    });

    const app2 = await Application.create({
      studentId: s3User._id,
      jobId: job2._id,
      companyId: company2._id,
      status: 'Selected'
    });

    await Interview.create({
      applicationId: app1._id,
      studentId: s1User._id,
      companyId: company1._id,
      date: '2026-10-05',
      time: '11:00 AM',
      mode: 'Online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      round: 'Technical Round 1 (Data Structures & System Design)',
      notes: 'Please keep your IDE ready for live coding.'
    });

    await Notification.create({
      userId: s1User._id,
      title: 'Application Shortlisted 🚀',
      message: 'Congratulations! You have been shortlisted for Google - MERN Stack Developer.'
    });

    console.log('✅ Database Seeding Completed Successfully!');
    console.log('\n--- TEST ACCOUNTS ---');
    console.log('Admin:   admin@placement.com / admin123');
    console.log('HR 1:    hr@google.com / hr1234');
    console.log('HR 2:    hr@microsoft.com / hr1234');
    console.log('Student 1: student1@college.edu / student123 (Eligible CSE 8.5 CGPA)');
    console.log('Student 2: student2@college.edu / student123 (Partially Eligible ECE 6.2 CGPA)');
    console.log('Student 3: student3@college.edu / student123 (Placed IT 9.1 CGPA)');

    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedData();
