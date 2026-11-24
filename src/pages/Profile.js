import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosInstance';
import { Avatar, Chips } from '../components/ui';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/users/profile/${user._id}`)
      .then((res) => {
        setProfile(res.data);
        updateUser({ name: res.data.name, email: res.data.email });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('Could not load your profile.');
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id]);

  if (error) return <div className="page"><div className="alert-app alert-error">{error}</div></div>;
  if (!profile) return <div className="page muted">Loading profile…</div>;

  const noSkills = !profile.skillsOffered?.length && !profile.skillsWanted?.length;

  return (
    <div className="page">
      <div className="page-head">
        <div className="eyebrow">Your profile</div>
        <h1>This is what people <em>see.</em></h1>
      </div>
      <div className="card-app">
        <div className="profile-head">
          <Avatar name={profile.name} size="avatar-xl" />
          <div>
            <h1>{profile.name}</h1>
            <div className="muted">{profile.email}</div>
          </div>
          <div className="actions">
            <Link to="/edit-profile" className="btn-app btn-primary-app">Edit skills</Link>
            <Link to="/dashboard" className="btn-app btn-ghost">View matches</Link>
          </div>
        </div>

        {noSkills && (
          <div className="alert-app alert-ok mt-4 mb-0">
            Add the skills you can teach and want to learn to start getting matches.
          </div>
        )}

        <div className="skill-grid">
          <div className="skill-block">
            <h3>I can teach</h3>
            <Chips items={profile.skillsOffered} empty="No skills added yet" />
          </div>
          <div className="skill-block">
            <h3>I want to learn</h3>
            <Chips items={profile.skillsWanted} teal empty="No skills added yet" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
