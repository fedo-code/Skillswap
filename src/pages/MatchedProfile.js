import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { Avatar, Chips } from '../components/ui';

const MatchedProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setPerson(null);
    axios
      .get(`/users/profile/${id}`)
      .then((res) => setPerson(res.data))
      .catch(() => setError('This profile was not found.'));
  }, [id]);

  if (error) return <div className="page"><div className="alert-app alert-error">{error}</div></div>;
  if (!person) return <div className="page muted">Loading…</div>;

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <Link to="/dashboard" className="back-link">← Back to matches</Link>
      <div className="card-app mt-3">
        <div className="profile-head">
          <Avatar name={person.name} size="avatar-xl" />
          <div>
            <h1>{person.name}</h1>
            <div className="muted">{person.email}</div>
          </div>
          <div className="actions">
            <button className="btn-app btn-primary-app" onClick={() => navigate(`/swaps/new/${id}`)}>
              Propose a swap
            </button>
            <button className="btn-app btn-ghost" onClick={() => navigate(`/messages/chat/${id}`)}>
              Message
            </button>
          </div>
        </div>
        <div className="skill-grid">
          <div className="skill-block">
            <h3>Can teach</h3>
            <Chips items={person.skillsOffered} teal />
          </div>
          <div className="skill-block">
            <h3>Wants to learn</h3>
            <Chips items={person.skillsWanted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchedProfile;
