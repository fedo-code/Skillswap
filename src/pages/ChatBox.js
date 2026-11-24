import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Avatar, timeLabel } from '../components/ui';

const ChatBox = () => {
  const { id } = useParams(); // recipient id
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const logRef = useRef(null);

  useEffect(() => {
    axios
      .get(`/users/profile/${id}`)
      .then((res) => setRecipientName(res.data.name))
      .catch(() => setRecipientName(''));
  }, [id]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`/messages/${id}`);
      setMessages(res.data);
      window.dispatchEvent(new Event('refreshConversationsFully'));
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // keep the newest message in view
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      await axios.post('/messages', { recipientId: id, content: newMsg.trim() });
      setNewMsg('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div className="card-app chat">
        <div className="chat-head">
          <Link to="/messages" aria-label="Back to messages">←</Link>
          <Avatar name={recipientName || 'U'} size="avatar-sm" />
          <h2>{recipientName || 'Chat'}</h2>
          <Link to={`/matched-profile/${id}`} className="ms-auto">View profile</Link>
        </div>

        <div className="chat-log" ref={logRef}>
          {messages.length === 0 && <p className="muted text-center my-auto">No messages yet. Say hello! 👋</p>}
          {messages.map((msg) => (
            <div key={msg._id} className={`bubble ${msg.sender === user._id ? 'me' : 'them'}`}>
              {msg.content}
              <small>{timeLabel(msg.createdAt)}</small>
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={handleSend}>
          <input
            className="input-app"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your message…"
          />
          <button className="btn-app btn-primary-app" disabled={!newMsg.trim()}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
