import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui';
import { StatusPill, whenLabel } from './Swaps';

const SwapDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [swap, setSwap] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState({ title: '', url: '' });

  useEffect(() => {
    axios
      .get(`/swaps/${id}`)
      .then((r) => setSwap(r.data))
      .catch(() => setError('Swap not found.'));
  }, [id]);

  const setStatus = async (status) => {
    setBusy(true);
    setError('');
    try {
      const r = await axios.patch(`/swaps/${id}/status`, { status });
      setSwap(r.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update the swap.');
    } finally {
      setBusy(false);
    }
  };

  const addResource = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const r = await axios.post(`/swaps/${id}/resources`, res);
      setSwap(r.data);
      setRes({ title: '', url: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add that.');
    }
  };

  if (error && !swap) return <div className="page"><div className="alert-app alert-error">{error}</div></div>;
  if (!swap) return <div className="page muted">Loading…</div>;

  const iAmProposer = swap.proposer._id === user._id;
  const other = iAmProposer ? swap.partner : swap.proposer;
  const iTeach = iAmProposer ? swap.proposerTeaches : swap.partnerTeaches;
  const iLearn = iAmProposer ? swap.partnerTeaches : swap.proposerTeaches;
  const closed = ['declined', 'cancelled'].includes(swap.status);

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <Link to="/swaps" className="back-link">← All swaps</Link>

      <div className="card-app mt-3">
        <div className="profile-head">
          <Avatar name={other.name} size="avatar-xl" />
          <div>
            <div className="eyebrow">Swap with</div>
            <h1 style={{ fontSize: '2rem' }}>{other.name}</h1>
            <StatusPill status={swap.status} />
          </div>
          <div className="actions">
            <Link to={`/messages/chat/${other._id}`} className="btn-app btn-ghost">Message</Link>
          </div>
        </div>

        {error && <div className="alert-app alert-error mt-3">{error}</div>}

        <div className="skill-grid">
          <div className="skill-block"><div className="label-sm">You teach</div><h3>{iTeach}</h3></div>
          <div className="skill-block"><div className="label-sm">You learn</div><h3>{iLearn}</h3></div>
        </div>

        <div className="detail-rows">
          <div><div className="label-sm">When</div><b>{whenLabel(swap.scheduledAt)}</b> · {swap.durationMin} min</div>
          {swap.meetingLink && (
            <div>
              <div className="label-sm">External meeting link</div>
              <a href={swap.meetingLink} target="_blank" rel="noreferrer" className="back-link">Open Google Meet / Zoom link ↗</a>
            </div>
          )}
          {swap.note && <div><div className="label-sm">Note from {swap.proposer.name.split(' ')[0]}</div>{swap.note}</div>}
        </div>

        <div className="d-flex flex-wrap gap-2 mt-4">
          {swap.status === 'pending' && !iAmProposer && (
            <>
              <button className="btn-app btn-primary-app" disabled={busy} onClick={() => setStatus('accepted')}>Accept swap</button>
              <button className="btn-app btn-ghost" disabled={busy} onClick={() => setStatus('declined')}>Decline</button>
            </>
          )}
          {swap.status === 'accepted' && (
            <Link to={`/swaps/${id}/room`} className="btn-app btn-primary-app">Join video session</Link>
          )}
          {swap.status === 'accepted' && (
            <button className="btn-app btn-ghost" disabled={busy} onClick={() => setStatus('completed')}>Mark as completed</button>
          )}
          {['pending', 'accepted'].includes(swap.status) && (
            <button className="btn-app btn-ghost" disabled={busy} onClick={() => setStatus('cancelled')}>Cancel swap</button>
          )}
        </div>
        {swap.status === 'pending' && iAmProposer && (
          <p className="muted mt-3 mb-0">Waiting for {other.name.split(' ')[0]} to accept.</p>
        )}
      </div>

      <div className="card-app mt-4">
        <h2 style={{ fontSize: '1.6rem' }}>Shared resources</h2>
        <p className="muted">Links, tutorials, or notes for this lesson. Both of you can add.</p>

        {swap.resources.length === 0 && <p className="empty-line">Nothing shared yet.</p>}
        <ul className="res-list">
          {swap.resources.map((r) => (
            <li key={r._id}>
              {r.url ? <a href={r.url} target="_blank" rel="noreferrer"><b>{r.title}</b> ↗</a> : <b>{r.title}</b>}
              <small className="muted"> added by {r.addedBy?._id === user._id ? 'you' : r.addedBy?.name}</small>
            </li>
          ))}
        </ul>

        {!closed && (
          <form onSubmit={addResource} className="res-form">
            <input className="input-app" placeholder="Title, e.g. Beginner chords PDF" required value={res.title} onChange={(e) => setRes({ ...res, title: e.target.value })} />
            <input className="input-app" type="url" placeholder="https://… (optional)" value={res.url} onChange={(e) => setRes({ ...res, url: e.target.value })} />
            <button className="btn-app btn-primary-app">Add</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SwapDetail;
