'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery'];
const STATUSES = ['All', 'Open', 'In Progress', 'Closed'];
const API = process.env.NEXT_PUBLIC_API_URL;

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
}

const categoryIcons: Record<string, string> = {
  Plumbing: '🔧',
  Electrical: '⚡',
  Painting: '🎨',
  Joinery: '🪚',
};

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  Open: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', dot: '#22c55e' },
  'In Progress': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
  Closed: { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', dot: '#94a3b8' },
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (status !== 'All') params.set('status', status);
    if (searchDebounce) params.set('search', searchDebounce);

    try {
      const res = await fetch(`${API}/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [category, status, searchDebounce]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              🏠
            </div>
            <div>
              <h1
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                ServiceBoard
              </h1>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  margin: 0,
                }}
              >
                Service Request Board
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link
              href="/auth"
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-muted)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Sign In
            </Link>
            <Link
              href="/jobs/new"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'var(--transition)',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.35)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px' }}>+</span> New Request
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero Section */}
        <div
          className="animate-fade-in-up"
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            Find & Post Service Requests
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Connect with trusted tradespeople in your area for plumbing, electrical, painting and joinery jobs.
          </p>
        </div>

        {/* Filters */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '28px',
            flexWrap: 'wrap',
            animationDelay: '0.1s',
          }}
        >
          {/* Search */}
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '14px',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              id="search-input"
              type="text"
              placeholder="Search jobs by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                transition: 'var(--transition)',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Category filter */}
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '10px 36px 10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              transition: 'var(--transition)',
              outline: 'none',
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? '📋 All Categories' : `${categoryIcons[c] || ''} ${c}`}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: '10px 36px 10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              transition: 'var(--transition)',
              outline: 'none',
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <p
            className="animate-fade-in"
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: '16px',
            }}
          >
            {jobs.length} {jobs.length === 1 ? 'request' : 'requests'} found
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: '120px', borderRadius: 'var(--radius)' }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && (
          <div
            className="animate-fade-in-up"
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              borderRadius: 'var(--radius)',
              border: '1px dashed var(--border)',
              background: 'var(--bg-secondary)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}
            >
              No requests found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Try adjusting your filters or create the first service request.
            </p>
            <Link
              href="/jobs/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              + Create Request
            </Link>
          </div>
        )}

        {/* Job Cards */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {jobs.map((job, index) => {
            const sc = statusConfig[job.status];
            return (
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="animate-fade-in-up"
                  style={{
                    padding: '20px 24px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.boxShadow = '0 0 30px var(--accent-glow)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '16px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '18px' }}>
                          {categoryIcons[job.category] || '📋'}
                        </span>
                        <h3
                          style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          {job.title}
                        </h3>
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          margin: '0 0 10px 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {job.description}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          📍 {job.location}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          📂 {job.category}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          🕐 {timeAgo(job.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: sc.bg,
                        color: sc.color,
                        fontSize: '12px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: sc.dot,
                        }}
                      />
                      {job.status}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '20px 24px',
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          ServiceBoard — GlobalTNA Mini Service Request Board
        </p>
      </footer>
    </div>
  );
}