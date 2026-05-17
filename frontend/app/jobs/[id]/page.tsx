'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;
const STATUSES = ['Open', 'In Progress', 'Closed'];

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

export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch(`${API}/jobs/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Job not found');
        return r.json();
      })
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const updateStatus = async (status: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`${API}/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setJob(updated);
      }
    } catch {
      setError('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const deleteJob = async () => {
    if (!confirm('Are you sure you want to delete this service request? This action cannot be undone.'))
      return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`${API}/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        router.push('/');
      } else if (res.status === 401) {
        router.push('/auth');
      } else {
        setError('Failed to delete job');
      }
    } catch {
      setError('Network error');
    } finally {
      setDeleting(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <header
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 24px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏠</div>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>ServiceBoard</span>
            </Link>
          </div>
        </header>
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
          <div className="skeleton" style={{ height: '20px', width: '140px', marginBottom: '24px' }} />
          <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius)' }} />
        </main>
      </div>
    );
  }

  // Not found
  if (!job) {
    return (
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <header
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 24px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏠</div>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>ServiceBoard</span>
            </Link>
          </div>
        </header>
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div className="animate-fade-in-up">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Job Not Found</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              The service request you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
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
              ← Back to all requests
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const sc = statusConfig[job.status];

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
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}
          >
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
            <span style={{ fontSize: '18px', fontWeight: 700 }}>ServiceBoard</span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Back link */}
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 0',
            border: 'none',
            background: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '24px',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          ← Back to all requests
        </button>

        {/* Error banner */}
        {error && (
          <div
            className="animate-slide-down"
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger)',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        {/* Main card */}
        <div
          className="animate-fade-in-up"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          {/* Header section */}
          <div
            style={{
              padding: '28px 28px 20px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{categoryIcons[job.category] || '📋'}</span>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{job.title}</h1>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📍 {job.location}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📂 {job.category}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📅 {new Date(job.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: sc.bg,
                  color: sc.color,
                  fontSize: '13px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: sc.dot,
                  }}
                />
                {job.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px',
              }}
            >
              Description
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
              {job.description}
            </p>
          </div>

          {/* Contact info */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '14px',
              }}
            >
              Contact Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                }}
              >
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Name
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, margin: 0 }}>
                  {job.contactName || '—'}
                </p>
              </div>
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                }}
              >
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email
                </p>
                <p style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 500, margin: 0 }}>
                  {job.contactEmail ? (
                    <a
                      href={`mailto:${job.contactEmail}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {job.contactEmail}
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                Update Status:
              </label>
              <select
                id="status-select"
                value={job.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={statusUpdating}
                style={{
                  padding: '8px 36px 8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  cursor: statusUpdating ? 'wait' : 'pointer',
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
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="delete-button"
              onClick={deleteJob}
              disabled={deleting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: deleting ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                if (!deleting) {
                  e.currentTarget.style.background = 'var(--danger)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'var(--danger)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--danger-bg)';
                e.currentTarget.style.color = 'var(--danger)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
            >
              {deleting ? 'Deleting...' : '🗑 Delete Request'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}