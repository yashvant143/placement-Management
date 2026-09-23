import React, { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';

import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Building2,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Briefcase,
  Search,
  X,
} from 'lucide-react';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  /* =========================
     FETCH INTERVIEWS
  ========================= */

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data } = await API.get(
        '/students/interviews'
      );

      setInterviews(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        'Failed to fetch interviews:',
        err
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================
     FILTER INTERVIEWS
  ========================= */

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const company =
        item.companyId?.name || '';

      const job =
        item.applicationId?.jobId?.title || '';

      const searchText =
        `${company} ${job} ${item.round || ''}`
          .toLowerCase();

      const matchesSearch =
        !search ||
        searchText.includes(
          search.toLowerCase()
        );

      const matchesMode =
        !modeFilter ||
        item.mode === modeFilter;

      return (
        matchesSearch &&
        matchesMode
      );
    });
  }, [interviews, search, modeFilter]);

  /* =========================
     STATS
  ========================= */

  const onlineCount = interviews.filter(
    (item) =>
      item.mode?.toLowerCase() ===
        'online' ||
      item.mode?.toLowerCase() ===
        'remote'
  ).length;

  const inPersonCount = interviews.filter(
    (item) =>
      item.mode?.toLowerCase() ===
        'offline' ||
      item.mode?.toLowerCase() ===
        'in-person' ||
      item.mode?.toLowerCase() ===
        'in person'
  ).length;

  /* =========================
     CLEAR FILTERS
  ========================= */

  const clearFilters = () => {
    setSearch('');
    setModeFilter('');
  };

  const hasFilters =
    search || modeFilter;

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
          HEADER
      ========================= */}

      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
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
              <Calendar
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
                Interview Schedule
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
                Keep track of your upcoming
                technical and HR interview
                rounds.
              </p>
            </div>
          </div>
        </div>

        {/* Refresh */}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            fetchInterviews(true)
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
          SUMMARY CARDS
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
        {/* Total */}

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
            <Calendar
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
              Total Interviews
            </div>

            <strong
              style={{
                fontSize: '1.2rem',
              }}
            >
              {interviews.length}
            </strong>
          </div>
        </div>

        {/* Online */}

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
                'rgba(56,189,248,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Video
              size={20}
              color="#38bdf8"
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
              Online Interviews
            </div>

            <strong
              style={{
                fontSize: '1.2rem',
              }}
            >
              {onlineCount}
            </strong>
          </div>
        </div>

        {/* In Person */}

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
                'rgba(192,132,252,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapPin
              size={20}
              color="#c084fc"
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
              In-Person
            </div>

            <strong
              style={{
                fontSize: '1.2rem',
              }}
            >
              {inPersonCount}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================
          FILTER BAR
      ========================= */}

      {!loading &&
        interviews.length > 0 && (
          <div
            className="glass-card"
            style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: '220px',
                position: 'relative',
              }}
            >
              <Search
                size={17}
                color="var(--text-muted)"
                style={{
                  position:
                    'absolute',
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
                placeholder="Search company, role or interview round..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>

            <select
              className="input-field"
              style={{
                width: '170px',
              }}
              value={modeFilter}
              onChange={(e) =>
                setModeFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All Modes
              </option>

              <option value="Online">
                Online
              </option>

              <option value="Offline">
                Offline
              </option>

              <option value="In-Person">
                In-Person
              </option>
            </select>

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
                    '0.55rem 0.7rem',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems:
                    'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <X size={14} />
                Clear
              </button>
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
            alignItems: 'center',
            justifyContent: 'center',
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
              borderTopColor:
                '#818cf8',
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
            Loading interview schedules...
          </span>
        </div>
      ) : interviews.length === 0 ? (
        /* =========================
           EMPTY STATE
        ========================= */

        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '65px',
              height: '65px',
              borderRadius: '17px',
              background:
                'rgba(99,102,241,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin:
                '0 auto 1rem',
            }}
          >
            <Calendar
              size={30}
              color="#818cf8"
            />
          </div>

          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              margin:
                '0 0 0.4rem',
            }}
          >
            No Interviews Scheduled
          </h3>

          <p
            style={{
              maxWidth: '450px',
              margin:
                '0 auto',
              color:
                'var(--text-secondary)',
              fontSize: '0.8rem',
              lineHeight: 1.6,
            }}
          >
            You don't have any upcoming
            technical or HR interview
            rounds scheduled right now.
            Keep checking your
            applications for updates.
          </p>
        </div>
      ) : filteredInterviews.length === 0 ? (
        /* =========================
           FILTER EMPTY
        ========================= */

        <div
          className="glass-card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <Search
            size={30}
            color="#818cf8"
            style={{
              marginBottom: '0.75rem',
            }}
          />

          <h3
            style={{
              margin:
                '0 0 0.4rem',
              fontSize: '1rem',
            }}
          >
            No Matching Interviews
          </h3>

          <p
            style={{
              margin:
                '0 0 1rem',
              color:
                'var(--text-secondary)',
              fontSize: '0.8rem',
            }}
          >
            Try changing your search or
            filter.
          </p>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Result Count */}

          <div
            style={{
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
            }}
          >
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {filteredInterviews.length}{' '}
              Scheduled Interview
              {filteredInterviews.length !==
              1
                ? 's'
                : ''}
            </span>
          </div>

          {/* =========================
              INTERVIEW GRID
          ========================= */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredInterviews.map(
              (item) => {
                const company =
                  item.companyId || {};

                const job =
                  item.applicationId
                    ?.jobId || {};

                return (
                  <div
                    key={item._id}
                    className="glass-card"
                    style={{
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection:
                        'column',
                      minHeight:
                        '350px',
                      transition:
                        'transform 0.2s ease, border-color 0.2s ease',
                    }}
                  >
                    {/* Top */}

                    <div
                      style={{
                        display:
                          'flex',
                        justifyContent:
                          'space-between',
                        alignItems:
                          'center',
                        gap: '0.5rem',
                        marginBottom:
                          '1rem',
                      }}
                    >
                      <span
                        className="badge badge-info"
                      >
                        {item.round ||
                          'Interview Round'}
                      </span>

                      <span
                        className="badge badge-warning"
                      >
                        {item.mode ||
                          'Mode'}
                      </span>
                    </div>

                    {/* Company */}

                    <div
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'center',
                        gap: '0.75rem',
                        marginBottom:
                          '1rem',
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius:
                            '11px',
                          background:
                            'rgba(99,102,241,0.1)',
                          display:
                            'flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                          flexShrink: 0,
                        }}
                      >
                        <Building2
                          size={21}
                          color="#818cf8"
                        />
                      </div>

                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <h3
                          style={{
                            fontSize:
                              '1rem',
                            fontWeight:
                              700,
                            color:
                              '#ffffff',
                            margin: 0,
                            overflow:
                              'hidden',
                            textOverflow:
                              'ellipsis',
                            whiteSpace:
                              'nowrap',
                          }}
                        >
                          {company.name ||
                            'Recruiting Company'}
                        </h3>

                        <p
                          style={{
                            fontSize:
                              '0.75rem',
                            color:
                              'var(--text-secondary)',
                            margin:
                              '0.2rem 0 0',
                          }}
                        >
                          {job.title ||
                            'Software Developer'}
                        </p>
                      </div>
                    </div>

                    {/* Schedule Box */}

                    <div
                      style={{
                        background:
                          'rgba(0,0,0,0.18)',
                        border:
                          '1px solid var(--border)',
                        padding:
                          '0.9rem',
                        borderRadius:
                          '10px',
                        display:
                          'flex',
                        flexDirection:
                          'column',
                        gap:
                          '0.75rem',
                        marginBottom:
                          '1rem',
                      }}
                    >
                      {/* Date */}

                      <div
                        style={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap:
                            '0.65rem',
                        }}
                      >
                        <div
                          style={{
                            width:
                              '30px',
                            height:
                              '30px',
                            borderRadius:
                              '8px',
                            background:
                              'rgba(56,189,248,0.1)',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                          }}
                        >
                          <Calendar
                            size={15}
                            color="#38bdf8"
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize:
                                '0.68rem',
                              color:
                                'var(--text-secondary)',
                            }}
                          >
                            Date
                          </div>

                          <strong
                            style={{
                              fontSize:
                                '0.8rem',
                            }}
                          >
                            {item.date ||
                              'Not specified'}
                          </strong>
                        </div>
                      </div>

                      {/* Time */}

                      <div
                        style={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap:
                            '0.65rem',
                        }}
                      >
                        <div
                          style={{
                            width:
                              '30px',
                            height:
                              '30px',
                            borderRadius:
                              '8px',
                            background:
                              'rgba(251,191,36,0.1)',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                          }}
                        >
                          <Clock
                            size={15}
                            color="#fbbf24"
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize:
                                '0.68rem',
                              color:
                                'var(--text-secondary)',
                            }}
                          >
                            Time
                          </div>

                          <strong
                            style={{
                              fontSize:
                                '0.8rem',
                            }}
                          >
                            {item.time ||
                              'Not specified'}
                          </strong>
                        </div>
                      </div>

                      {/* Mode */}

                      <div
                        style={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap:
                            '0.65rem',
                        }}
                      >
                        <div
                          style={{
                            width:
                              '30px',
                            height:
                              '30px',
                            borderRadius:
                              '8px',
                            background:
                              'rgba(192,132,252,0.1)',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                          }}
                        >
                          <MapPin
                            size={15}
                            color="#c084fc"
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize:
                                '0.68rem',
                              color:
                                'var(--text-secondary)',
                            }}
                          >
                            Interview Mode
                          </div>

                          <strong
                            style={{
                              fontSize:
                                '0.8rem',
                            }}
                          >
                            {item.mode ||
                              'Not specified'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}

                    {item.notes && (
                      <div
                        style={{
                          padding:
                            '0.75rem',
                          borderRadius:
                            '8px',
                          background:
                            'rgba(245,158,11,0.06)',
                          border:
                            '1px solid rgba(245,158,11,0.12)',
                          marginBottom:
                            '1rem',
                        }}
                      >
                        <div
                          style={{
                            fontSize:
                              '0.68rem',
                            color:
                              '#fbbf24',
                            fontWeight:
                              700,
                            marginBottom:
                              '0.25rem',
                          }}
                        >
                          INTERVIEW NOTE
                        </div>

                        <p
                          style={{
                            fontSize:
                              '0.75rem',
                            color:
                              'var(--text-secondary)',
                            margin: 0,
                            lineHeight:
                              1.5,
                          }}
                        >
                          {item.notes}
                        </p>
                      </div>
                    )}

                    {/* Bottom Button */}

                    <div
                      style={{
                        marginTop:
                          'auto',
                      }}
                    >
                      {item.meetingLink ? (
                        <a
                          href={
                            item.meetingLink
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                          style={{
                            width:
                              '100%',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                            gap:
                              '0.45rem',
                          }}
                        >
                          <Video
                            size={16}
                          />

                          Join Interview

                          <ExternalLink
                            size={14}
                          />
                        </a>
                      ) : (
                        <div
                          style={{
                            padding:
                              '0.7rem',
                            borderRadius:
                              '8px',
                            background:
                              'rgba(255,255,255,0.03)',
                            border:
                              '1px solid var(--border)',
                            textAlign:
                              'center',
                            fontSize:
                              '0.72rem',
                            color:
                              'var(--text-secondary)',
                          }}
                        >
                          <MapPin
                            size={14}
                            style={{
                              verticalAlign:
                                'middle',
                              marginRight:
                                '0.3rem',
                            }}
                          />

                          In-person interview
                          or meeting link
                          will be shared by
                          HR.
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </>
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

          @media (max-width: 700px) {
            .page-body {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
          }

          @media (max-width: 500px) {
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

export default InterviewsPage;