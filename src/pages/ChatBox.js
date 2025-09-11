
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const ChatBox = () => { 
  const { id } = useParams(); // recipientId
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [recipientName, setRecipientName] = useState('');

  // ✅ Fetch recipient info (always correct)
  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const res = await axios.get(`/users/${id}`); // API to get recipient info
        setRecipientName(res.data.name);
      } catch (err) {
        console.error('Error fetching recipient name:', err);
      }
    };
    fetchRecipient();
  }, [id]);

  // ✅ Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`/messages/${id}`);
      setMessages(res.data);
      window.dispatchEvent(new Event("refreshConversationsFully"));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, [id]);

  useEffect(() => { 
    fetchMessages();
    setTimeout(() => window.dispatchEvent(new Event('refreshConversationsFully')), 500);
  }, [fetchMessages]);

  // ✅ Send message
  const handleSend = async () => {
    if (!newMsg.trim()) return;

    try {
      await axios.post('/messages', { recipientId: id, content: newMsg });
      setNewMsg('');
      fetchMessages();
    } catch (err) { 
      console.error('Error sending message:', err); 
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      {/* ✅ Chat header always shows recipient name */}
      <h2>Chat with {recipientName || 'User'}</h2>

      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '10px',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '8px',
        background: '#f9f9f9'
      }}>
        {messages.map((msg) => (
          <p key={msg._id}> 
            <strong>
              {msg.sender === user._id ? 'Me' : msg.senderName || 'User'}:
            </strong> {msg.content} 
            <br />
            <small style={{ color: "#888" }}>
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleString([], {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : ""}
            </small>
          </p>
        ))}
      </div>

      <textarea
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Type your message..."
        style={{ width: '100%', height: '60px', marginBottom: '10px' }}
      />
      <br />
      <button 
        onClick={handleSend} 
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatBox;
