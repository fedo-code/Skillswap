import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import './Messages.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  // ✅ Only ONE definition of fetchConversations
  const fetchConversations = async () => {
    try {
      const res = await axios.get('/messages');
      setConversations(res.data);   
      console.log('📡 Conversations fetched:', res.data);    
    } catch (err) {
      console.error('❌ Failed to load conversations:', err);
    }
  };

  useEffect(() => { 
    fetchConversations(); // 🟢 initial load

    // ✅ Listen to refresh event from ChatBox
    const listener = () => {
      console.log('📥 refreshConversationsFully received');
      fetchConversations();
    };

    window.addEventListener('refreshConversationsFully', listener);
    return () => window.removeEventListener('refreshConversationsFully', listener);
  }, []);

  const handleOpenChat = (userId) => {
    navigate(`/messages/chat/${userId}`);

    // 🔄 Optionally, optimistic update:
    setConversations((prev) =>
      prev.map((conv) =>
        conv.userId === userId ? { ...conv, unread: 0 } : conv
      )
    );
  };

  return (
    <div>
      <h2>Your Conversations</h2>
      <ul className="messages-list" style={{ listStyle: 'none', padding: 0 }}>
        {conversations.map((c) => (
          <li key={c.userId}> 
            <div
               className="message-box" 
               onClick={() => handleOpenChat(c.userId)}
             
            >
              
                <strong>{c.name}</strong>
                {c.unread > 0 && (
                  <span style={{ color: 'red', marginLeft: '8px' }}>
                    {c.unread} unread
                  </span>
                )}
                <div style={{ marginTop: '6px', fontSize: '14px', color: '#555' }}> 
                  {c.lastMessage}
                </div>
             
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;   
