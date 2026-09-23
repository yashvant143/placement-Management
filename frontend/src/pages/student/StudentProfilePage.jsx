import React, { useEffect, useState } from 'react';
import API from '../../services/api';

import {
  User,
  FileText,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  GraduationCap,
  Phone,
  Building2,
  Award,
  Code2,
  ExternalLink,
  X,
  FileUp,
  Briefcase,
} from 'lucide-react';

const StudentProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college: '',
    branch: 'CSE',
    cgpa: 0,
    tenthPercentage: 0,
    twelfthPercentage: 0,
    passingYear: 2027,
    skills: '',
    resumeUrl: '',
  });

  const [projects, setProjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [msg, setMsg] = useState({
    type: '',
    text: '',
  });

  /* =========================
     FETCH PROFILE
  ========================= */

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/students/profile');

      setFormData({
        name: data.userId?.name || '',
        phone: data.userId?.phone || '',
        college: data.college || 'Institute of Technology',
        branch: data.branch || 'CSE',
        cgpa: data.cgpa || 0,
        tenthPercentage: data.tenthPercentage || 0,
        twelfthPercentage: data.twelfthPercentage || 0,
        passingYear: data.passingYear || 2027,
        skills: Array.isArray(data.skills)
          ? data.skills.join(', ')
          : '',
        resumeUrl: data.resumeUrl || '',
      });

      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);

      setMsg({
        type: 'error',
        text: 'Unable to load profile information.',
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PROFILE COMPLETION
  ========================= */

  const calculateCompletion = () => {
    const fields = [
      formData.name,
      formData.phone,
      formData.college,
      formData.branch,
      formData.cgpa > 0,
      formData.tenthPercentage > 0,
      formData.twelfthPercentage > 0,
      formData.passingYear,
      formData.skills,
      formData.resumeUrl,
      projects.length > 0,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round((completed / fields.length) * 100);
  };

  const completion = calculateCompletion();

  /* =========================
     INPUT HANDLER
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     SAVE PROFILE
  ========================= */

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    setMsg({
      type: '',
      text: '',
    });

    try {
      await API.put('/students/profile', {
        ...formData,

        cgpa: Number(formData.cgpa),

        tenthPercentage: Number(
          formData.tenthPercentage
        ),

        twelfthPercentage: Number(
          formData.twelfthPercentage
        ),

        passingYear: Number(formData.passingYear),

        skills: formData.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),

        projects,
      });

      setMsg({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (err) {
      console.error(err);

      setMsg({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Profile update failed.',
      });
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     RESUME UPLOAD
  ========================= */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      setMsg({
        type: 'error',
        text: 'Only PDF, DOC and DOCX files are allowed.',
      });

      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg({
        type: 'error',
        text: 'Resume size must be less than 5MB.',
      });

      e.target.value = '';
      return;
    }

    setSelectedFile(file);

    setMsg({
      type: '',
      text: '',
    });
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMsg({
        type: 'error',
        text: 'Please select a resume first.',
      });

      return;
    }

    setUploading(true);

    setMsg({
      type: '',
      text: '',
    });

    const data = new FormData();

    data.append('resume', selectedFile);

    try {
      const res = await API.post(
        '/students/resume',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        resumeUrl: res.data.resumeUrl,
      }));

      setSelectedFile(null);

      setMsg({
        type: 'success',
        text: 'Resume uploaded successfully!',
      });
    } catch (err) {
      console.error(err);

      setMsg({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Resume upload failed.',
      });
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     PROJECT FUNCTIONS
  ========================= */

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        title: '',
        description: '',
        link: '',
      },
    ]);
  };

  const removeProject = (index) => {
    setProjects((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleProjectChange = (
    index,
    field,
    value
  ) => {
    setProjects((prev) =>
      prev.map((project, i) =>
        i === index
          ? {
              ...project,
              [field]: value,
            }
          : project
      )
    );
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div
        className="page-body"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
        <div
          className="glass-card"
          style={{
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(129,140,248,0.25)',
              borderTopColor: '#818cf8',
              animation: 'spin 1s linear infinite',
            }}
          />

          <span
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Loading your profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page-body"
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        paddingBottom: '3rem',
      }}
    >
      {/* =========================
          HEADER
      ========================= */}

      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.4rem',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
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
              <User size={22} color="white" />
            </div>

            <div>
              <h2
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                Student Profile
              </h2>

              <p
                style={{
                  margin: '0.2rem 0 0',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                }}
              >
                Manage your personal, academic and
                professional information.
              </p>
            </div>
          </div>
        </div>

        {/* Completion */}

        <div
          style={{
            minWidth: '210px',
            padding: '0.9rem 1rem',
            borderRadius: '12px',
            background:
              'rgba(79,70,229,0.08)',
            border:
              '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontSize: '0.8rem',
            }}
          >
            <span
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              Profile Completion
            </span>

            <strong
              style={{
                color:
                  completion === 100
                    ? '#34d399'
                    : '#818cf8',
              }}
            >
              {completion}%
            </strong>
          </div>

          <div
            style={{
              height: '7px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${completion}%`,
                height: '100%',
                borderRadius: '10px',
                background:
                  'linear-gradient(90deg, #4f46e5, #8b5cf6)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================
          MESSAGE
      ========================= */}

      {msg.text && (
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',

            background:
              msg.type === 'success'
                ? 'rgba(16,185,129,0.12)'
                : 'rgba(244,63,94,0.12)',

            color:
              msg.type === 'success'
                ? '#34d399'
                : '#f87171',

            border:
              msg.type === 'success'
                ? '1px solid rgba(16,185,129,0.25)'
                : '1px solid rgba(244,63,94,0.25)',
          }}
        >
          {msg.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span>{msg.text}</span>
        </div>
      )}

      {/* =========================
          QUICK PROFILE OVERVIEW
      ========================= */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
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
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(79,70,229,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GraduationCap
              size={20}
              color="#818cf8"
            />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
              }}
            >
              Current CGPA
            </div>

            <strong
              style={{
                fontSize: '1.1rem',
              }}
            >
              {formData.cgpa || '—'}
            </strong>
          </div>
        </div>

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
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16,185,129,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={20} color="#34d399" />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
              }}
            >
              Graduation
            </div>

            <strong
              style={{
                fontSize: '1.1rem',
              }}
            >
              {formData.passingYear}
            </strong>
          </div>
        </div>

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
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245,158,11,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Code2 size={20} color="#fbbf24" />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
              }}
            >
              Skills
            </div>

            <strong
              style={{
                fontSize: '1.1rem',
              }}
            >
              {formData.skills
                ? formData.skills
                    .split(',')
                    .filter(Boolean).length
                : 0}
            </strong>
          </div>
        </div>

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
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(139,92,246,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase
              size={20}
              color="#a78bfa"
            />
          </div>

          <div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
              }}
            >
              Projects
            </div>

            <strong
              style={{
                fontSize: '1.1rem',
              }}
            >
              {projects.length}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================
          RESUME SECTION
      ========================= */}

      <div
        className="glass-card"
        style={{
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1.2rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background:
                  'rgba(239,68,68,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText
                size={21}
                color="#f87171"
              />
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                Resume
              </h3>

              <p
                style={{
                  margin: '0.25rem 0 0',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                }}
              >
                Upload your latest resume for
                recruiters.
              </p>
            </div>
          </div>

          <span
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: 600,
              background: formData.resumeUrl
                ? 'rgba(16,185,129,0.12)'
                : 'rgba(245,158,11,0.12)',
              color: formData.resumeUrl
                ? '#34d399'
                : '#fbbf24',
            }}
          >
            {formData.resumeUrl
              ? 'Resume Added'
              : 'Resume Required'}
          </span>
        </div>

        {/* Existing Resume */}

        {formData.resumeUrl && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              background:
                'rgba(79,70,229,0.08)',
              border:
                '1px solid rgba(99,102,241,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <FileText
                size={18}
                color="#818cf8"
              />

              <div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  Current Resume
                </div>

                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Your resume is attached to
                  your profile.
                </div>
              </div>
            </div>

            <a
              href={formData.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              View Resume
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Selected File */}

        {selectedFile && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '9px',
              background:
                'rgba(16,185,129,0.08)',
              border:
                '1px solid rgba(16,185,129,0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                minWidth: 0,
              }}
            >
              <FileUp
                size={18}
                color="#34d399"
              />

              <div
                style={{
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedFile.name}
                </div>

                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)}{' '}
                  MB
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={removeSelectedFile}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#f87171',
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <form
          onSubmit={handleResumeUpload}
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="input-field"
            style={{
              padding: '0.55rem 0.75rem',
              flex: 1,
              minWidth: '220px',
            }}
            onChange={handleFileChange}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              uploading || !selectedFile
            }
            style={{
              minWidth: '150px',
            }}
          >
            <Upload size={16} />

            {uploading
              ? 'Uploading...'
              : 'Upload Resume'}
          </button>
        </form>

        <p
          style={{
            margin: '0.7rem 0 0',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
          }}
        >
          Supported formats: PDF, DOC, DOCX ·
          Maximum size: 5MB
        </p>
      </div>

      {/* =========================
          PROFILE FORM
      ========================= */}

      <form
        onSubmit={handleProfileSubmit}
        className="glass-card"
        style={{
          padding: '1.5rem',
        }}
      >
        {/* Personal */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            paddingBottom: '1rem',
            borderBottom:
              '1px solid var(--border)',
            marginBottom: '1.25rem',
          }}
        >
          <User
            size={19}
            color="#818cf8"
          />

          <div>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                margin: 0,
              }}
            >
              Personal Information
            </h3>

            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
              }}
            >
              Basic information used in your
              student profile.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          <div className="input-group">
            <label className="input-label">
              Full Name
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >
              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  color:
                    'var(--text-secondary)',
                }}
              />

              <input
                type="text"
                name="name"
                className="input-field"
                style={{
                  paddingLeft: '2.4rem',
                }}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">
              Phone Number
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >
              <Phone
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  color:
                    'var(--text-secondary)',
                }}
              />

              <input
                type="tel"
                name="phone"
                className="input-field"
                style={{
                  paddingLeft: '2.4rem',
                }}
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div
            className="input-group"
            style={{
              gridColumn: '1 / -1',
            }}
          >
            <label className="input-label">
              College Name
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >
              <Building2
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  color:
                    'var(--text-secondary)',
                }}
              />

              <input
                type="text"
                name="college"
                className="input-field"
                style={{
                  paddingLeft: '2.4rem',
                }}
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter college name"
              />
            </div>
          </div>
        </div>

        {/* Academic */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            paddingBottom: '1rem',
            borderBottom:
              '1px solid var(--border)',
            marginTop: '2rem',
            marginBottom: '1.25rem',
          }}
        >
          <GraduationCap
            size={19}
            color="#34d399"
          />

          <div>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                margin: 0,
              }}
            >
              Academic Details
            </h3>

            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
              }}
            >
              Academic information used for
              placement eligibility.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div className="input-group">
            <label className="input-label">
              Branch / Specialization
            </label>

            <select
              name="branch"
              className="input-field"
              value={formData.branch}
              onChange={handleChange}
            >
              <option value="CSE">
                Computer Science Engineering
              </option>

              <option value="IT">
                Information Technology
              </option>

              <option value="CSE-AIML">
                CSE - AI & ML
              </option>

              <option value="ECE">
                Electronics & Communication
              </option>

              <option value="EEE">
                Electrical Engineering
              </option>

              <option value="MECH">
                Mechanical Engineering
              </option>

              <option value="CIVIL">
                Civil Engineering
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">
              Current CGPA
            </label>

            <input
              type="number"
              name="cgpa"
              step="0.01"
              min="0"
              max="10"
              className="input-field"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              10th Percentage
            </label>

            <input
              type="number"
              name="tenthPercentage"
              step="0.1"
              min="0"
              max="100"
              className="input-field"
              value={formData.tenthPercentage}
              onChange={handleChange}
              placeholder="0.0"
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              12th Percentage
            </label>

            <input
              type="number"
              name="twelfthPercentage"
              step="0.1"
              min="0"
              max="100"
              className="input-field"
              value={formData.twelfthPercentage}
              onChange={handleChange}
              placeholder="0.0"
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Graduation Year
            </label>

            <input
              type="number"
              name="passingYear"
              min="2020"
              max="2050"
              className="input-field"
              value={formData.passingYear}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Skills */}

        <div
          style={{
            marginTop: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1rem',
            }}
          >
            <Code2
              size={19}
              color="#fbbf24"
            />

            <div>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Technical Skills
              </h3>

              <p
                style={{
                  margin: '0.2rem 0 0',
                  fontSize: '0.72rem',
                  color:
                    'var(--text-secondary)',
                }}
              >
                Add technologies and tools you
                know.
              </p>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              className="input-field"
              placeholder="Java, JavaScript, React, Node.js, MongoDB, SQL, Git"
              value={formData.skills}
              onChange={handleChange}
            />

            <p
              style={{
                fontSize: '0.7rem',
                color:
                  'var(--text-secondary)',
                marginTop: '0.4rem',
              }}
            >
              Separate multiple skills using
              commas.
            </p>
          </div>

          {/* Skill Preview */}

          {formData.skills && (
            <div
              style={{
                display: 'flex',
                gap: '0.45rem',
                flexWrap: 'wrap',
                marginTop: '0.75rem',
              }}
            >
              {formData.skills
                .split(',')
                .map((skill) => skill.trim())
                .filter(Boolean)
                .map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding:
                        '0.35rem 0.65rem',
                      borderRadius: '20px',
                      background:
                        'rgba(99,102,241,0.1)',
                      border:
                        '1px solid rgba(99,102,241,0.2)',
                      color: '#a5b4fc',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Projects */}

        <div
          style={{
            marginTop: '2rem',
            borderTop:
              '1px solid var(--border)',
            paddingTop: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <Briefcase
                size={19}
                color="#a78bfa"
              />

              <div>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Projects
                </h3>

                <p
                  style={{
                    margin: '0.2rem 0 0',
                    fontSize: '0.72rem',
                    color:
                      'var(--text-secondary)',
                  }}
                >
                  Showcase your development
                  projects.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={addProject}
            >
              <Plus size={14} />
              Add Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                border:
                  '1px dashed var(--border)',
                borderRadius: '10px',
                color:
                  'var(--text-secondary)',
              }}
            >
              <Briefcase
                size={30}
                style={{
                  opacity: 0.5,
                  marginBottom: '0.5rem',
                }}
              />

              <div
                style={{
                  fontSize: '0.8rem',
                }}
              >
                No projects added yet.
              </div>

              <div
                style={{
                  fontSize: '0.7rem',
                  marginTop: '0.2rem',
                }}
              >
                Add your projects to improve
                your profile.
              </div>
            </div>
          ) : (
            projects.map((project, index) => (
              <div
                key={index}
                style={{
                  background:
                    'rgba(0,0,0,0.12)',
                  border:
                    '1px solid var(--border)',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '0.8rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                    marginBottom:
                      '0.8rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color:
                        'var(--text-secondary)',
                      fontWeight: 600,
                    }}
                  >
                    PROJECT {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeProject(index)
                    }
                    style={{
                      border: 'none',
                      background:
                        'rgba(239,68,68,0.08)',
                      color: '#f87171',
                      width: '30px',
                      height: '30px',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                    }}
                    title="Remove Project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Project Title"
                    className="input-field"
                    value={project.title}
                    onChange={(e) =>
                      handleProjectChange(
                        index,
                        'title',
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="url"
                    placeholder="GitHub / Live Link"
                    className="input-field"
                    value={project.link}
                    onChange={(e) =>
                      handleProjectChange(
                        index,
                        'link',
                        e.target.value
                      )
                    }
                  />
                </div>

                <textarea
                  placeholder="Describe your project, technologies used and key features..."
                  className="input-field"
                  rows="3"
                  value={project.description}
                  onChange={(e) =>
                    handleProjectChange(
                      index,
                      'description',
                      e.target.value
                    )
                  }
                  style={{
                    resize: 'vertical',
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Save */}

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop:
              '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{
              minWidth: '190px',
              padding: '0.75rem 1.2rem',
            }}
          >
            <Save size={17} />

            {saving
              ? 'Saving Changes...'
              : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* Small animation */}

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

          @media (max-width: 600px) {
            .page-body {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default StudentProfilePage;