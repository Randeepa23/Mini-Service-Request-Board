'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
const CATEGORIES = ['Plumbing', 'Electrical', 'Painting', 'Joinery'];

const categoryIcons: Record<string, string> = {
  Plumbing: '🔧',
  Electrical: '⚡',
  Painting: '🎨',
  Joinery: '🪚',
};

interface FormErrors {
  title?: string;
  description?: string;
  contactEmail?: string;
  location?: string;
  server?: string;
}

export default function NewJob() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    location: '',
    contactName: '',
    contactEmail: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (!form.description.trim()) errs.description = 'Description is required';
    else if (form.description.trim().length < 10)
      errs.description = 'Description must be at least 10 characters';
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail))
      errs.contactEmail = 'Please enter a valid email address';
    if (!form.location.trim()) errs.location = 'Location is required';
    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ title: true, description: true, contactEmail: true, location: true });

    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    try {
      const res = await fetch(`${API}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/');
      } else if (res.status === 401) {
        router.push('/auth');
      } else {
        const d = await res.json();
        setErrors({ server: d.error || 'Something went wrong' });
      }
    } catch {
      setErrors({ server: 'Network error. Is the backend running?' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (field: string, hasError: boolean) => ({
    width: '100%',
    padding: '12px 14px',
    borderRadius: 'var(--radius-sm)',
    border: `1px solid ${hasError && touched[field] ? 'var(--danger)' : 'var(--border)'}`,
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    transition: 'var(--transition)',
    outline: 'none',
  });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)';
    e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow)';
  };

  const handleBlurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
    const hasError = touched[field] && !!errors[field as keyof FormErrors];
    e.currentTarget.style.borderColor = hasError ? 'var(--danger)' : 'var(--border)';
    e.currentTarget.style.boxShadow = 'none';
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
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'inherit',
            }}
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

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Back button */}
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

        {/* Form Card */}
        <div
          className="animate-fade-in-up"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '32px',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '4px',
              color: 'var(--text-primary)',
            }}
          >
            New Service Request
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
            Fill in the details below to post a new service request.
          </p>

          {errors.server && (
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
              {errors.server}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Title <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="title-input"
                type="text"
                placeholder="e.g. Leaking kitchen tap needs fixing"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onFocus={handleFocus}
                onBlur={(e) => {
                  handleBlur('title');
                  handleBlurStyle(e, 'title');
                }}
                style={inputStyle('title', !!errors.title)}
              />
              {touched.title && errors.title && (
                <p
                  className="animate-slide-down"
                  style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}
                >
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Description <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                id="description-input"
                rows={4}
                placeholder="Describe the issue in detail..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                onFocus={handleFocus}
                onBlur={(e) => {
                  handleBlur('description');
                  handleBlurStyle(e, 'description');
                }}
                style={{
                  ...inputStyle('description', !!errors.description),
                  resize: 'vertical',
                  minHeight: '100px',
                }}
              />
              {touched.description && errors.description && (
                <p
                  className="animate-slide-down"
                  style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}
                >
                  {errors.description}
                </p>
              )}
            </div>

            {/* Category + Location row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Category
                </label>
                <select
                  id="category-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlurStyle(e, 'category')}
                  style={{
                    ...inputStyle('category', false),
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {categoryIcons[c]} {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Location <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="location-input"
                  type="text"
                  placeholder="e.g. Glasgow"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  onFocus={handleFocus}
                  onBlur={(e) => {
                    handleBlur('location');
                    handleBlurStyle(e, 'location');
                  }}
                  style={inputStyle('location', !!errors.location)}
                />
                {touched.location && errors.location && (
                  <p
                    className="animate-slide-down"
                    style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}
                  >
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Name + Email row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Contact Name
                </label>
                <input
                  id="contact-name-input"
                  type="text"
                  placeholder="Your name"
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlurStyle(e, 'contactName')}
                  style={inputStyle('contactName', false)}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Contact Email
                </label>
                <input
                  id="contact-email-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  onFocus={handleFocus}
                  onBlur={(e) => {
                    handleBlur('contactEmail');
                    handleBlurStyle(e, 'contactEmail');
                  }}
                  style={inputStyle('contactEmail', !!errors.contactEmail)}
                />
                {touched.contactEmail && errors.contactEmail && (
                  <p
                    className="animate-slide-down"
                    style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}
                  >
                    {errors.contactEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              id="submit-button"
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: submitting
                  ? 'var(--text-muted)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
                boxShadow: submitting ? 'none' : '0 0 20px rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.35)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = submitting
                  ? 'none'
                  : '0 0 20px rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {submitting ? 'Submitting...' : '✨ Submit Request'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}