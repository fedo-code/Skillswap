
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MatchedProfile = () => {
  const { id } = useParams();
  const [matchedUser, setMatchedUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatchedUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/users/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatchedUser(res.data); 
      } catch (err) {
        console.error('Error loading matched user profile:', err);
        setError("Matched user not found or unauthorized");
      }
    };

    fetchMatchedUser();
  }, [id]);

  const handleMessageClick = () => {
    navigate(`/messages/chat/${id}`); 
  };

  return (
    <div
      style={{
        
        minHeight: '100vh',
        paddingTop: '40px',
        paddingBottom: '40px',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Matched User Profile</h2>
      {error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      ) : matchedUser ? (
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: 'purple',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <h3>{matchedUser.name}</h3>
          <p><strong>Email:</strong> {matchedUser.email}</p>
          <p><strong>Skills Offered:</strong> {matchedUser.skillsOffered.join(', ')}</p>
          <p><strong>Skills Wanted:</strong> {matchedUser.skillsWanted.join(', ')}</p>

          <button
            onClick={handleMessageClick}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Message {matchedUser.name}
          </button>
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      )}
    </div>
  );
};

export default MatchedProfile;


