import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import StatCard from '../../components/StatCard';
import JobCard from '../../components/JobCard';
import {
  Briefcase,
  FileCheck,
  Calendar,
  Award,
  User,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, jobsRes, appsRes, intRes] = await Promise.all([
          API.get('/students/profile'),
          API.get('/jobs'),
          API.get('/students/applications'),
          API.get('/students/interviews')
        ]);

        setProfile(profRes.data);
        setJobs(jobsRes.data || []);
        setApplications(appsRes.data || []);
        setInterviews(intRes.data || []);
      } catch (err) {
        console.error('Dashboard loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const appliedJobIds = applications.map(
    (a) => a.jobId?._id || a.jobId
  );

  const eligibleJobs = jobs.filter(
    (job) => job.eligibility?.isEligible
  );

  const shortlistedApps = applications.filter(
    (app) =>
      app.status === 'Shortlisted' ||
      app.status === 'Interview' ||
      app.status === 'Selected'
  );

  const selectedApps = applications.filter(
    (app) => app.status === 'Selected'
  );

  const profileFields = [
    profile?.branch,
    profile?.cgpa,
    profile?.passingYear,
    profile?.skills,
    profile?.resume
  ];

  const completedProfileFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round(
    (completedProfileFields / profileFields.length) * 100
  );

  const handleApply = async (jobId) => {
    try {
      setApplyingJob(jobId);

      await API.post('/applications', { jobId });

      const appsRes = await API.get('/students/applications');
      setApplications(appsRes.data || []);

      alert('Application submitted successfully! 🚀');
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to apply for this drive'
      );
    } finally {
      setApplyingJob(null);
    }
  };

  if (loading) {
    return (
      <div
        className="page-body"
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '45px',
              height: '45px',
              border: '3px solid rgba(129, 140, 248, 0.2)',
              borderTop: '3px solid #818cf8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}
          />

          <h3 style={{ marginBottom: '0.4rem' }}>
            Loading your dashboard
          </h3>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem'
            }}
          >
            Fetching your placement information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">

      {/* ================= HERO SECTION ================= */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          marginBottom: '1.75rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(129, 140, 248, 0.18)',
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(168,85,247,0.05))'
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.08)',
            right: '-80px',
            top: '-100px'
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'rgba(168,85,247,0.06)',
            right: '120px',
            bottom: '-90px'
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <span className="badge badge-info">
              <Sparkles size={12} />
              STUDENT PORTAL
            </span>

            {profile?.placementStatus === 'Placed' ? (
              <span className="badge badge-success">
                🎉 PLACED
              </span>
            ) : (
              <span className="badge badge-warning">
                ACTIVELY SEEKING
              </span>
            )}
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: 800,
              marginBottom: '0.65rem',
              lineHeight: 1.2
            }}
          >
            Welcome back,{' '}
            <span className="title-gradient">
              {user?.name || 'Student'}
            </span>
            👋
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              fontSize: '0.92rem',
              lineHeight: 1.7,
              marginBottom: '1.25rem'
            }}
          >
            Track your placement applications, explore eligible
            opportunities and stay updated with your upcoming
            interviews — all from one place.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '0.65rem',
              flexWrap: 'wrap'
            }}
          >
            <div className="badge badge-neutral">
              <GraduationCap size={13} />
              {profile?.branch || 'Branch not set'}
            </div>

            <div className="badge badge-neutral">
              CGPA: {profile?.cgpa || 'Not set'}
            </div>

            <div className="badge badge-neutral">
              Batch: {profile?.passingYear || 'Not set'}
            </div>
          </div>
        </div>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 750,
              marginBottom: '0.2rem'
            }}
          >
            Placement Overview
          </h3>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.82rem'
            }}
          >
            Your current placement activity at a glance
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Eligible Drives"
          value={eligibleJobs.length}
          icon={Briefcase}
          color="#818cf8"
          subtitle="Matching your profile"
        />

        <StatCard
          title="Applications"
          value={applications.length}
          icon={FileCheck}
          color="#38bdf8"
          subtitle="Applications submitted"
        />

        <StatCard
          title="Shortlisted"
          value={shortlistedApps.length}
          icon={Award}
          color="#fbbf24"
          subtitle="Active recruitment rounds"
        />

        <StatCard
          title="Interviews"
          value={interviews.length}
          icon={Calendar}
          color="#c084fc"
          subtitle="Scheduled interviews"
        />
      </div>

      {/* ================= PROFILE + APPLICATION STATUS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.6fr)',
          gap: '1.25rem',
          marginTop: '1.5rem',
          marginBottom: '2rem'
        }}
      >

        {/* Application Journey */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.3rem'
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 750
                }}
              >
                Placement Journey
              </h3>

              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  marginTop: '0.25rem'
                }}
              >
                Track your progress
              </p>
            </div>

            <CheckCircle2
              size={21}
              style={{ color: '#34d399' }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(4, minmax(0, 1fr))',
              gap: '0.5rem'
            }}
          >
            {[
              {
                title: 'Profile',
                value: profileCompletion >= 60,
                number: '01'
              },
              {
                title: 'Applied',
                value: applications.length > 0,
                number: '02'
              },
              {
                title: 'Shortlisted',
                value: shortlistedApps.length > 0,
                number: '03'
              },
              {
                title: 'Selected',
                value: selectedApps.length > 0,
                number: '04'
              }
            ].map((step) => (
              <div
                key={step.number}
                style={{
                  textAlign: 'center',
                  padding: '0.85rem 0.4rem',
                  borderRadius: '12px',
                  background: step.value
                    ? 'rgba(52,211,153,0.08)'
                    : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${
                    step.value
                      ? 'rgba(52,211,153,0.2)'
                      : 'rgba(255,255,255,0.06)'
                  }`
                }}
              >
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem'
                  }}
                >
                  {step.number}
                </div>

                {step.value ? (
                  <CheckCircle2
                    size={20}
                    style={{
                      color: '#34d399',
                      marginBottom: '0.35rem'
                    }}
                  />
                ) : (
                  <Clock3
                    size={20}
                    style={{
                      color: 'var(--text-secondary)',
                      marginBottom: '0.35rem'
                    }}
                  />
                )}

                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 650
                  }}
                >
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Completion */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              marginBottom: '1rem'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(129,140,248,0.12)'
              }}
            >
              <User size={19} style={{ color: '#818cf8' }} />
            </div>

            <div>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 750
                }}
              >
                Profile Completion
              </h3>

              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)'
                }}
              >
                Keep your profile updated
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)'
              }}
            >
              Completion
            </span>

            <strong style={{ fontSize: '0.8rem' }}>
              {profileCompletion}%
            </strong>
          </div>

          <div
            style={{
              height: '7px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.07)',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}
          >
            <div
              style={{
                width: `${profileCompletion}%`,
                height: '100%',
                borderRadius: '20px',
                background:
                  'linear-gradient(90deg, #6366f1, #a855f7)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
            onClick={() => navigate('/student/profile')}
          >
            <User size={14} />
            Update Profile
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ================= JOB DRIVES ================= */}
      <div style={{ marginBottom: '2.5rem' }}>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                marginBottom: '0.3rem'
              }}
            >
              <Building2
                size={19}
                style={{ color: '#818cf8' }}
              />

              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 750
                }}
              >
                Recommended Placement Drives
              </h3>
            </div>

            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}
            >
              Opportunities based on your academic profile
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/student/jobs')}
          >
            View All Drives
            <ArrowRight size={14} />
          </button>
        </div>

        {jobs.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center'
            }}
          >
            <Briefcase
              size={35}
              style={{
                color: 'var(--text-secondary)',
                marginBottom: '0.8rem'
              }}
            />

            <h3
              style={{
                fontSize: '1rem',
                marginBottom: '0.35rem'
              }}
            >
              No active placement drives
            </h3>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem'
              }}
            >
              New opportunities will appear here when they are
              available.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.2rem'
            }}
          >
            {jobs.slice(0, 3).map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isApplied={appliedJobIds.includes(job._id)}
                onApply={handleApply}
                userRole="student"
                applying={applyingJob === job._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= UPCOMING INTERVIEWS ================= */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 750
              }}
            >
              Upcoming Interviews
            </h3>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                marginTop: '0.25rem'
              }}
            >
              Stay prepared for your scheduled rounds
            </p>
          </div>

          <Calendar
            size={20}
            style={{ color: '#c084fc' }}
          />
        </div>

        {interviews.length === 0 ? (
          <div
            style={{
              padding: '1.5rem',
              textAlign: 'center',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.08)'
            }}
          >
            <Calendar
              size={28}
              style={{
                color: 'var(--text-secondary)',
                marginBottom: '0.6rem'
              }}
            />

            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}
            >
              No interviews scheduled right now.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.7rem'
            }}
          >
            {interviews.map((item) => (
              <div
                key={item._id}
                className="glass-card"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        'rgba(192,132,252,0.1)'
                    }}
                  >
                    <Calendar
                      size={18}
                      style={{ color: '#c084fc' }}
                    />
                  </div>

                  <div>
                    <h4
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        marginBottom: '0.25rem'
                      }}
                    >
                      {item.round || 'Interview'}{' '}
                      {item.companyId?.name
                        ? `- ${item.companyId.name}`
                        : ''}
                    </h4>

                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      📅 {item.date} &nbsp;•&nbsp; {item.time}
                      {item.mode && ` • ${item.mode}`}
                    </p>
                  </div>
                </div>

                {item.meetingLink && (
                  <a
                    href={item.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Join Meeting
                    <ChevronRight size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;