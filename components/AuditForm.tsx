import { useState } from 'react';

const NICHES = [
  'Life Coach',
  'Business / Executive Coach',
  'Fitness / Health Coach',
  'Relationship Coach',
  'Career Coach',
  'Consultant',
  'Therapist / Counsellor',
  'Course Creator',
  'Other',
];

const CHALLENGES = [
  "I get traffic but nobody books calls",
  "I spend hours chasing unqualified leads",
  "I don't have a website yet",
  "My current site looks outdated and generic",
  "I have no lead capture / follow-up system",
  "Other",
];

type Situation = 'new-website' | 'existing-website' | 'not-sure';
type PresenceType = 'website' | 'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'other';

interface PresenceItem {
  type: PresenceType;
  value: string;
}

export default function AuditForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [niche, setNiche] = useState('');
  const [situation, setSituation] = useState<Situation | ''>('');
  const [challenge, setChallenge] = useState('');
  const [pricing, setPricing] = useState('');
  const [presence, setPresence] = useState<PresenceItem[]>([{ type: 'website', value: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const updatePresence = (idx: number, patch: Partial<PresenceItem>) => {
    setPresence((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };

  const addPresence = () => {
    setPresence((prev) => [...prev, { type: 'linkedin', value: '' }]);
  };

  const removePresence = (idx: number) => {
    setPresence((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !niche || !situation || !challenge) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    const cleanedPresence = presence
      .map((item) => ({ ...item, value: item.value.trim() }))
      .filter((item) => item.value);

    try {
      const res = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          niche,
          situation,
          challenge,
          pricing,
          presence: cleanedPresence,
          leadSource: 'website-form',
        }),
      });

      if (!res.ok) throw new Error('Server error');
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again or WhatsApp Abu Bakar directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="audit-form-box">
        <div className="form-success">
          <div className="form-success-icon">✨</div>
          <h3>You're all set, {name.split(' ')[0]}!</h3>
          <p>
            Abu Bakar will personally review your details and send you a specific AI idea
            for your situation, usually within a few hours.
          </p>
          <p style={{ marginTop: 12, fontSize: '0.82rem' }}>
            Keep an eye on <strong style={{ color: 'var(--gold)' }}>{email}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="audit-form-box" onSubmit={handleSubmit} noValidate>
      {/* Name + Email */}
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Your Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Sarah Ahmed"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Phone (optional) */}
      <div className="form-group">
        <label className="form-label">WhatsApp Number (optional, for faster reply)</label>
        <input
          type="tel"
          className="form-input"
          placeholder="+1 (202) 555-0123"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Niche */}
      <div className="form-group">
        <label className="form-label">What type of coach or consultant are you? *</label>
        <select
          className="form-select"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          required
        >
          <option value="">Select your niche…</option>
          {NICHES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Situation: new vs existing */}
      <div className="form-group">
        <label className="form-label">What's your website situation? *</label>
        <div className="radio-row">
          {([
            ['new-website', '🆕 Build me a new website'],
            ['existing-website', '🔧 Upgrade my existing site'],
            ['not-sure', '🤔 Not sure yet'],
          ] as [Situation, string][]).map(([val, label]) => (
            <div
              key={val}
              className={`radio-opt ${situation === val ? 'selected' : ''}`}
              onClick={() => setSituation(val)}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Challenge */}
      <div className="form-group">
        <label className="form-label">What's your biggest challenge right now? *</label>
        <select
          className="form-select"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          required
        >
          <option value="">Select your challenge…</option>
          {CHALLENGES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Current Presence */}
      <div className="form-group">
        <label className="form-label">Where can I review your current presence? (optional)</label>
        {presence.map((item, idx) => (
          <div key={`${item.type}-${idx}`} className="presence-row">
            <select
              className="form-select"
              value={item.type}
              onChange={(e) => updatePresence(idx, { type: e.target.value as PresenceType })}
            >
              <option value="website">Website</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              className="form-input"
              placeholder="Paste URL or @handle"
              value={item.value}
              onChange={(e) => updatePresence(idx, { value: e.target.value })}
            />
            <button
              type="button"
              className="presence-remove"
              onClick={() => removePresence(idx)}
              aria-label="Remove presence field"
              disabled={presence.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="presence-add" onClick={addPresence}>
          + Add another profile
        </button>
      </div>

      {/* Pricing */}
      <div className="form-group">
        <label className="form-label">What budget or pricing range are you considering? (free text)</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Around $500-$1,000, open to recommendation"
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
        />
      </div>

      {error && (
        <p style={{ color: '#FF8888', fontSize: '0.82rem', marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>
          ⚠️ {error}
        </p>
      )}

      <button type="submit" className="form-submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Show Me My AI Growth Idea ✦'}
      </button>
      <p className="form-fine">🔒 No spam. No pitch calls. Just one real, specific AI idea for your business.</p>
    </form>
  );
}
