import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { Avatar, timeLabel } from '../components/ui';

const Messages = () => {
  const [conversations, setConversations] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = () =>
      axios
        .get('/messages')
        .then((res) => setConversations(res.data))
        .catch(() => setConversations([]));
    load();
    window.addEventListener('refreshConversationsFully', load);
    return () => window.removeEventListener('refreshConversationsFully', load);
  }, []);

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div className="page-head">
        <div className="eyebrow">Inbox</div>
        <h1>Say <em>hello.</em></h1>
        <p>Your conversations with matches.</p>
      </div>

      {!conversations && <p className="muted">Loading…</p>}

      {conversations && conversations.length === 0 && (
        <div className="card-app empty-state">
          <div className="emoji">💬</div>
          <h3>No conversations yet</h3>
          <p>Open a match and say hello to start swapping skills.</p>
          <Link to="/dashboard" className="btn-app btn-primary-app">Find matches</Link>
        </div>
      )}

      {conversations?.map((c) => (
        <div key={c.userId} className="card-app convo" onClick={() => navigate(`/messages/chat/${c.userId}`)}>
          <Avatar name={c.name} />
          <div className="convo-body">
            <div className="convo-top">
              <strong>{c.name}</strong>
              <small className="muted">{timeLabel(c.timestamp)}</small>
            </div>
            <div className="convo-last">{c.lastMessage}</div>
          </div>
          {c.unread > 0 && <span className="badge-unread">{c.unread}</span>}
        </div>
      ))}
    </div>
  );
};

export default Messages;
