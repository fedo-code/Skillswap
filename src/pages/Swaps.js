import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

export const whenLabel = (d) =>
  new Date(d).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const StatusPill = ({ status }) => <span className={`status status-${status}`}>{status}</span>;

const TABS = [
  ['requests', 'Requests'],
  ['upcoming', 'Upcoming'],
  ['past', 'Past'],
];

const Swaps = () => {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState(null);
  const [tab, setTab] = useState('upcoming');
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('/swaps')
      .then((res) => {
        setSwaps(res.data);
        const hasIncoming = res.data.some((s) => s.status === 'pending' && s.partner._id === user._id);
        if (hasIncoming) setTab('requests');
      })
      .catch(() => setError('Could not load your swaps.'));
  }, [user._id]);

  const groups = {
    requests: (swaps || []).filter((s) => s.status === 'pending'),
    upcoming: (swaps || []).filter((s) => s.status === 'accepted'),
    past: (swaps || []).filter((s) => ['completed', 'declined', 'cancelled'].includes(s.status)),
  };
  const list = groups[tab];

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <div className="page-head">
        <div className="eyebrow">Your swaps</div>
        <h1>Lessons you <em>give and get.</em></h1>
        <p>Each swap is a session where you teach one skill and learn another.</p>
      </div>

      {error && <div className="alert-app alert-error">{error}</div>}

      <div className="tabs">
        {TABS.map(([key, label]) => (
          <button key={key} className={`tab ${tab === key ? 'on' : ''}`} onClick={() => setTab(key)}>
            {label}{groups[key].length > 0 && <span className="tab-count">{groups[key].length}</span>}
          </button>
        ))}
      </div>

      {!swaps && !error && <p className="muted">Loading…</p>}

      {swaps && list.length === 0 && (
        <div className="card-app empty-state">
          <div className="emoji">📚</div>
          <h3>Nothing here yet</h3>
          <p>Open one of your matches and propose a swap to schedule your first lesson.</p>
          <Link to="/dashboard" className="btn-app btn-primary-app">Go to matches</Link>
        </div>
      )}

      {list.map((s) => {
        const iAmProposer = s.proposer._id === user._id;
        const other = iAmProposer ? s.partner : s.proposer;
        const iTeach = iAmProposer ? s.proposerTeaches : s.partnerTeaches;
        const iLearn = iAmProposer ? s.partnerTeaches : s.proposerTeaches;
        const incoming = s.status === 'pending' && !iAmProposer;
        return (
          <Link to={`/swaps/${s._id}`} key={s._id} className="card-app swap-card">
            <div className="swap-card-top">
              <strong>with {other.name}</strong>
              <StatusPill status={incoming ? 'needs reply' : s.status} />
            </div>
            <div className="swap-line">
              <span className="chip">Teach: {iTeach}</span>
              <span className="chip chip-teal">Learn: {iLearn}</span>
            </div>
            <div className="muted">{whenLabel(s.scheduledAt)} · {s.durationMin} min</div>
          </Link>
        );
      })}
    </div>
  );
};

export default Swaps;
