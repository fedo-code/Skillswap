
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    try {
      const res = await axios.get('/match');
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
     <div className="dashboard-container">
      <h2>Your Skill Matches</h2>
      {matches.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No matches yet. Update your skills in profile.</p>
      ) : (
        <ul className="dashboard-list">
          {matches.map((user) => (
            <li className="dashboard-user-box" key={user._id}>
              <Link to={`/matched-profile/${user._id}`}>
                <strong>{user.name}</strong> – Offers: {user.skillsOffered.join(', ')}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
