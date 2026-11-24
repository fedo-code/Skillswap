import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { whenLabel } from './Swaps';

// Jitsi Meet engine. Point REACT_APP_JITSI_DOMAIN at your own / JaaS server for production.
const JITSI_DOMAIN = process.env.REACT_APP_JITSI_DOMAIN || 'meet.jit.si';

const SwapRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [swap, setSwap] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`/swaps/${id}`)
      .then((r) => setSwap(r.data))
      .catch(() => setError('Swap not found.'));
  }, [id]);

  if (error) return <div className="page"><div className="alert-app alert-error">{error}</div></div>;
  if (!swap) return <div className="page muted">Loading…</div>;

  if (swap.status !== 'accepted') {
    return (
      <div className="page" style={{ maxWidth: 820 }}>
        <Link to={`/swaps/${id}`} className="back-link">← Back to swap</Link>
        <div className="alert-app alert-error mt-3">
          The video session opens once the swap has been accepted.
        </div>
      </div>
    );
  }

  const iAmProposer = swap.proposer._id === user._id;
  const other = iAmProposer ? swap.partner : swap.proposer;
  const hash = [
    `userInfo.displayName="${encodeURIComponent(user.name || 'Guest')}"`,
    'config.prejoinPageEnabled=false',
    'config.disableDeepLinking=true',
    `config.subject="${encodeURIComponent(`${swap.proposerTeaches} ⇄ ${swap.partnerTeaches}`)}"`,
  ].join('&');
  const src = `https://${JITSI_DOMAIN}/skillswap-${swap.roomId}#${hash}`;

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <Link to={`/swaps/${id}`} className="back-link">← Back to swap</Link>
      <div className="d-flex flex-wrap justify-content-between align-items-end mt-3 mb-3 gap-2">
        <div>
          <div className="eyebrow">Live session with {other.name}</div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{swap.proposerTeaches} ⇄ {swap.partnerTeaches}</h1>
          <small className="muted">Scheduled {whenLabel(swap.scheduledAt)} · {swap.durationMin} min</small>
        </div>
        <Link to={`/messages/chat/${other._id}`} className="btn-app btn-ghost">Message {other.name.split(' ')[0]}</Link>
      </div>

      <div className="card-app" style={{ padding: 0, overflow: 'hidden' }}>
        <iframe
          title="Swap video session"
          src={src}
          allow="camera; microphone; display-capture; fullscreen; autoplay"
          style={{ width: '100%', height: '70vh', minHeight: 440, border: 0, display: 'block' }}
        />
      </div>
      <p className="muted mt-3">
        Tip: use <b>Share screen</b> to teach, and the chat/whiteboard inside the room for notes. When you're done, go
        back and mark the swap completed.
      </p>
    </div>
  );
};

export default SwapRoom;
