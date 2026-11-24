import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui';

const norm = (s) => s.trim().toLowerCase();

const ProposeSwap = () => {
  const { partnerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [partner, setPartner] = useState(null);
  const [form, setForm] = useState({
    proposerTeaches: '', partnerTeaches: '', scheduledAt: '', durationMin: 60, meetingLink: '', note: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([axios.get(`/users/profile/${user._id}`), axios.get(`/users/profile/${partnerId}`)])
      .then(([a, b]) => {
        setMe(a.data);
        setPartner(b.data);
        // preselect the skills that line up
        const myOffer = a.data.skillsOffered || [];
        const theirOffer = b.data.skillsOffered || [];
        const theirWant = (b.data.skillsWanted || []).map(norm);
        const myWant = (a.data.skillsWanted || []).map(norm);
        setForm((f) => ({
          ...f,
          proposerTeaches: myOffer.find((s) => theirWant.includes(norm(s))) || myOffer[0] || '',
          partnerTeaches: theirOffer.find((s) => myWant.includes(norm(s))) || theirOffer[0] || '',
        }));
      })
      .catch(() => setError('Could not load profiles.'));
  }, [user._id, partnerId]);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await axios.post('/swaps', {
        ...form,
        partnerId,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      navigate(`/swaps/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send the swap request.');
      setSaving(false);
    }
  };

  if (error && !partner) return <div className="page"><div className="alert-app alert-error">{error}</div></div>;
  if (!me || !partner) return <div className="page muted">Loading…</div>;

  const noSkills = !me.skillsOffered?.length || !partner.skillsOffered?.length;

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <Link to={`/matched-profile/${partnerId}`} className="back-link">← Back to {partner.name}</Link>
      <div className="page-head mt-3">
        <div className="eyebrow">Propose a swap</div>
        <h1>Set up a lesson with <em>{partner.name.split(' ')[0]}.</em></h1>
        <p>Pick what each of you teaches and when. {partner.name.split(' ')[0]} can accept or decline.</p>
      </div>

      {noSkills ? (
        <div className="card-app empty-state">
          <h3>Add your skills first</h3>
          <p>Both of you need at least one skill to teach before you can plan a swap.</p>
          <Link to="/edit-profile" className="btn-app btn-primary-app">Edit my skills</Link>
        </div>
      ) : (
        <form className="card-app" onSubmit={submit}>
          {error && <div className="alert-app alert-error">{error}</div>}

          <div className="swap-pair">
            <div className="swap-side">
              <Avatar name={me.name} size="avatar-sm" />
              <label htmlFor="proposerTeaches">I will teach</label>
              <select id="proposerTeaches" name="proposerTeaches" className="input-app" value={form.proposerTeaches} onChange={set}>
                {me.skillsOffered.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="swap-arrow">⇄</div>
            <div className="swap-side">
              <Avatar name={partner.name} size="avatar-sm" />
              <label htmlFor="partnerTeaches">{partner.name.split(' ')[0]} will teach me</label>
              <select id="partnerTeaches" name="partnerTeaches" className="input-app" value={form.partnerTeaches} onChange={set}>
                {partner.skillsOffered.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="row-2">
            <div className="field">
              <label htmlFor="scheduledAt">Date and time</label>
              <input id="scheduledAt" name="scheduledAt" type="datetime-local" required className="input-app" value={form.scheduledAt} onChange={set} />
            </div>
            <div className="field">
              <label htmlFor="durationMin">Length</label>
              <select id="durationMin" name="durationMin" className="input-app" value={form.durationMin} onChange={set}>
                {[30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} minutes</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="meetingLink">Meeting link (optional)</label>
            <input id="meetingLink" name="meetingLink" type="url" className="input-app" placeholder="https://meet.google.com/…" value={form.meetingLink} onChange={set} />
            <div className="hint">Google Meet, Zoom, or any video link. You can also agree on this in chat.</div>
          </div>

          <div className="field">
            <label htmlFor="note">Message (optional)</label>
            <textarea id="note" name="note" rows="3" maxLength="500" className="input-app" placeholder="Say hi and what you hope to cover" value={form.note} onChange={set} />
          </div>

          <button className="btn-app btn-primary-app btn-lg" disabled={saving}>
            {saving ? 'Sending…' : 'Send swap request'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProposeSwap;
