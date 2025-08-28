
// pages/ChatBox.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const ChatBox = () => { 
  const { id } = useParams(); // recipientId
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  // ✅ Fetch messages & auto mark as read
  const fetchMessages = useCallback(async () => {
  try {
    const res = await axios.get(`/messages/${id}`);
      console.log("📩 Messages fetched for ChatBox:", res.data); // ✅ ADD THIS
    setMessages(res.data);

    // ✅ dispatch event after marking messages as read
    window.dispatchEvent(new Event("refreshConversationsFully"));
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
}, [id]);


useEffect(() => { 

  console.log("📤 ChatBox opened for recipientId:", id);
  fetchMessages();
  
  // ✅ Dispatch refresh event
  setTimeout(() => {
    window.dispatchEvent(new Event('refreshConversationsFully'));
    console.log("📤 refreshConversationsFully dispatched"); 
  }, 500); // small delay for backend update
}, [fetchMessages,id]);
 



  // ✅ Send message
  const handleSend = async () => {
    if (!newMsg.trim()) return;

    try {
      await axios.post('/messages' , {
        recipientId: id,
        content: newMsg, 
      }); 

      setNewMsg('');
      fetchMessages(); // 🔁 Refresh messages after sending
    } catch (err) { 
      console.error('Error sending message:', err); 
    }
  };

  return (
  <div style={{ padding: '20px', backgroundColor: 'transparent', minHeight: '100vh' }}>
    <h2>
      Chat with{' '}
      {messages.length > 0 
        ? messages[0].sender === user._id
          ? '...'
          : messages[0].senderName     
        : 'User'}
    </h2>

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
          <strong>{msg.sender === user._id ? 'Me'  : msg.senderName}:</strong> {msg.content} 
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
