import React, { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';
import JobCard from '../../components/JobCard';

import {
  Search,
  MapPin,
  SlidersHorizontal,
  Briefcase,
  CheckCircle,
  Clock,
  RefreshCw,
  X,
} from 'lucide-react';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [branch, setBranch] = useState('');
  const [onlyEligible, setOnlyEligible] = useState(false);

  useEffect(() => {
    fetchJobsAndApps();
  }, [search, location, branch]);

  /* =========================
     FETCH JOBS
  ========================= */

  const fetchJobsAndApps = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (location.trim()) {
        params.location = location.trim();
      }

      if (branch) {
        params.branch = branch;
      }

      const [jobsRes, appsRes] = await Promise.all([
        API.get('/jobs', { params }),
        API.get('/students/applications'),
      ]);

      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setApplications(
        Array.isArray(appsRes.data)
          ? appsRes.data
          : []
      );
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================
     APPLY JOB
  ========================= */

  const handleApply = async (jobId) => {
    try {
      await API.post('/applications', {
        jobId,
      });

      const appsRes = await API.get(
        '/students/applications'
      );

      setApplications(
        Array.isArray(appsRes.data)
          ? appsRes.data
          : []
      );

      alert(
        'Application submitted successfully! 🚀'
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to apply'
      );
    }
  };

  /* =========================
     APPLIED JOB IDS
  ========================= */

  const appliedJobIds = applications.map(
    (application) =>
      application.jobId?._id ||
      application.jobId
  );

  /* =========================
     DISPLAYED JOBS
  ========================= */

  const displayedJobs = useMemo(() => {
    if (onlyEligible) {
      return jobs.filter(
        (job) => job.eligibility?.isEligible
      );
    }

    return jobs;
  }, [jobs, onlyEligible]);

  /* =========================
     STATS
  ========================= */

  const eligibleCount = jobs.filter(
    (job) => job.eligibility?.isEligible
  ).length;

  const appliedCount = applications.filter(
    (application) => application.jobId
  ).length;

  /* =========================
     CLEAR FILTERS
  ========================= */

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setBranch('');
    setOnlyEligible(false);
  };

  const hasFilters =
    search ||
    location ||
    branch ||
    onlyEligible;

  return (
    <div
      className="page-body"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingBottom: '3rem',
      }}
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                background:
                  'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  '0 8px 25px rgba(79,70,229,0.25)',
              }}
            >
              <Briefcase
                size={22}
                color="white"
              />
            </div>

            <div>
              <h2
                style={{
                  fontSize: '1.55rem',
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                Placement Drives
              </h2>

              <p
                style={{
                  color:
                    'var(--text-secondary)',
                  fontSize: '0.82rem',
                  margin:
                    '0.25rem 0 0',
                }}
              >
                Explore active recruitment
                opportunities and apply to
                eligible jobs.
              </p>
            </div>
          </div>
        </div>

        {/* Refresh */}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            fetchJobsAndApps(true)
          }
          disabled={refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <RefreshCw
            size={15}
            style={{
              animation: refreshing
                ? 'spin 1s linear infinite'
                : 'none',
            }}
          />

          {refreshing
            ? 'Refreshing...'
            : 'Refresh'}
        </button>
      </div>

      {/* =========================
          OVERVIEW CARDS
      ========================= */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Total Jobs */}

        <div
          className="glass-card"
          style={{
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '11px',
              background:
                'rgba(79,70,229,0.13)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase
              size={20}
              color="#818cf8"
            />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.72rem',
                color:
                  'var(--text-secondary)',
              }}
            >
              Active Drives
            </div>

            <strong
              style={{
                fontSize: '1.2rem',
              }}
            >
              {jobs.length}
            </strong>
          </div>
        </div>

        {/* Eligible */}

        <div
          className="glass-card"
          style={{
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '11px',
              background:
                'rgba(16,185,129,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle
              size={20}
              color="#34d399"
            />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.72rem',
                color:
                  'var(--text-secondary)',
              }}
            >
              Eligible For You
            </div>

            <strong
              style={{
                fontSize: '1.2rem',
              }}
            >
              {eligibleCount}
            </strong>
          </div>
        </div>

        {/* Applied */}

        <div
          className="glass-card"
          style={{
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '11px',
              background:
                'rgba(245,158,11,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock
              size={20}
              color="#fbbf24"
            />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.72rem',
                color:
                  'var(--text-secondary)',
              }}
            >
              Applications
            </div>

            <strong
              style={{
                fontSize: '1.2rem',
              }}
            >
              {appliedCount}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================
          FILTER SECTION
      ========================= */}

      <div
        className="glass-card"
        style={{
          padding: '1.2rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <SlidersHorizontal
            size={17}
            color="#818cf8"
          />

          <span
            style={{
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            Find Opportunities
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(220px, 2fr) minmax(170px, 1fr) minmax(150px, 1fr)',
            gap: '0.75rem',
          }}
        >
          {/* Search */}

          <div
            style={{
              position: 'relative',
            }}
          >
            <Search
              size={17}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform:
                  'translateY(-50%)',
              }}
            />

            <input
              type="text"
              className="input-field"
              style={{
                paddingLeft: '2.4rem',
              }}
              placeholder="Search job title, company or keyword..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {/* Location */}

          <div
            style={{
              position: 'relative',
            }}
          >
            <MapPin
              size={16}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform:
                  'translateY(-50%)',
              }}
            />

            <input
              type="text"
              className="input-field"
              style={{
                paddingLeft: '2.3rem',
              }}
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
            />
          </div>

          {/* Branch */}

          <select
            className="input-field"
            value={branch}
            onChange={(e) =>
              setBranch(e.target.value)
            }
          >
            <option value="">
              All Branches
            </option>

            <option value="CSE">
              CSE
            </option>

            <option value="IT">
              IT
            </option>

            <option value="CSE-AIML">
              CSE-AIML
            </option>

            <option value="ECE">
              ECE
            </option>

            <option value="EEE">
              EEE
            </option>

            <option value="MECH">
              MECH
            </option>

            <option value="CIVIL">
              CIVIL
            </option>
          </select>
        </div>

        {/* Bottom Filters */}

        <div
          style={{
            marginTop: '1rem',
            paddingTop: '0.9rem',
            borderTop:
              '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) =>
                setOnlyEligible(
                  e.target.checked
                )
              }
              style={{
                width: '16px',
                height: '16px',
                accentColor:
                  'var(--primary)',
                cursor: 'pointer',
              }}
            />

            <span>
              Show only jobs I'm eligible
              for
            </span>
          </label>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              style={{
                border: 'none',
                background:
                  'rgba(239,68,68,0.08)',
                color: '#f87171',
                padding:
                  '0.45rem 0.7rem',
                borderRadius: '7px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* =========================
          RESULT HEADER
      ========================= */}

      {!loading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {displayedJobs.length}{' '}
              Opportunities
            </span>

            <span
              style={{
                fontSize: '0.75rem',
                color:
                  'var(--text-secondary)',
                marginLeft: '0.5rem',
              }}
            >
              matching your filters
            </span>
          </div>

          {onlyEligible && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding:
                  '0.35rem 0.65rem',
                borderRadius: '20px',
                background:
                  'rgba(16,185,129,0.1)',
                color: '#34d399',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle size={13} />
              Eligible Only
            </span>
          )}
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (
        <div
          className="glass-card"
          style={{
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.8rem',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border:
                '3px solid rgba(129,140,248,0.2)',
              borderTopColor: '#818cf8',
              animation:
                'spin 1s linear infinite',
            }}
          />

          <span
            style={{
              color:
                'var(--text-secondary)',
              fontSize: '0.85rem',
            }}
          >
            Loading placement drives...
          </span>
        </div>
      ) : displayedJobs.length === 0 ? (
        /* =========================
           EMPTY STATE
        ========================= */

        <div
          className="glass-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              margin: '0 auto 1rem',
              background:
                'rgba(99,102,241,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase
              size={28}
              color="#818cf8"
            />
          </div>

          <h3
            style={{
              margin: '0 0 0.4rem',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            No placement drives found
          </h3>

          <p
            style={{
              margin: '0 auto 1.2rem',
              maxWidth: '450px',
              color:
                'var(--text-secondary)',
              fontSize: '0.8rem',
              lineHeight: 1.6,
            }}
          >
            No jobs match your current
            search and filter settings.
            Try changing the filters or
            check again later.
          </p>

          {hasFilters && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        /* =========================
           JOB GRID
        ========================= */

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {displayedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isApplied={appliedJobIds.includes(
                job._id
              )}
              onApply={handleApply}
              userRole="student"
            />
          ))}
        </div>
      )}

      {/* Animation */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 800px) {
            .page-body {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
          }

          @media (max-width: 600px) {
            .page-body {
              padding-left: 0.75rem !important;
              padding-right: 0.75rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default JobsPage;