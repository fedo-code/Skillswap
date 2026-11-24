import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Avatar, Chips } from '../components/ui';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('/match')
      .then((res) => setMatches(res.data))
      .catch(() => setError('Could not load matches. Please try again.'));
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <div className="eyebrow">Your matches</div>
        <h1>{user?.name ? `${user.name.split(' ')[0]}, meet your ` : 'Meet your '}<em>swap partners.</em></h1>
        <p>People who can teach what you want to learn, and want what you teach.</p>
      </div>

      {error && <div className="alert-app alert-error">{error}</div>}
      {!matches && !error && <p className="muted">Finding your matches…</p>}

      {matches && matches.length === 0 && (
        <div className="card-app empty-state">
          <div className="emoji">🔍</div>
          <h3>No matches yet</h3>
          <p>Add the skills you can teach and want to learn. As more people join, matches will appear here.</p>
          <Link to="/edit-profile" className="btn-app btn-primary-app">Add my skills</Link>
        </div>
      )}

      {matches && matches.length > 0 && (
        <>
          <div className="stat-pill">{matches.length} {matches.length === 1 ? 'match' : 'matches'} found</div>
          <div className="match-grid">
            {matches.map((m) => (
              <div className="card-app match-card" key={m._id}>
                <div className="match-top">
                  <Avatar name={m.name} />
                  <h3>{m.name}</h3>
                </div>
                <div>
                  <div className="label-sm">They can teach you</div>
                  <Chips items={m.theyTeach} teal />
                </div>
                <div>
                  <div className="label-sm">You can teach them</div>
                  <Chips items={m.youTeach} />
                </div>
                <div className="match-actions">
                  <Link to={`/matched-profile/${m._id}`} className="btn-app btn-ghost">View profile</Link>
                  <button className="btn-app btn-primary-app" onClick={() => navigate(`/swaps/new/${m._id}`)}>
                    Propose swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
