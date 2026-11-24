import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosInstance';
import { TagInput } from '../components/ui';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [offered, setOffered] = useState([]);
  const [wanted, setWanted] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`/users/profile/${user._id}`)
      .then((res) => {
        setOffered(res.data.skillsOffered || []);
        setWanted(res.data.skillsWanted || []);
      })
      .catch(() => setError('Could not load your current skills.'))
      .finally(() => setLoaded(true));
  }, [user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await axios.patch(`/users/skills/${user._id}`, { skillsOffered: offered, skillsWanted: wanted });
      navigate('/dashboard'); // show matches right after saving
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save skills.');
      setSaving(false);
    }
  };

  if (!loaded) return <div className="page muted">Loading…</div>;

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="page-head">
        <div className="eyebrow">Edit profile</div>
        <h1>What do you <em>know</em>, and what do you want?</h1>
        <p>Type a skill and press Enter to add it. Matches are based on these lists.</p>
      </div>
      <form className="card-app" onSubmit={handleSubmit}>
        {error && <div className="alert-app alert-error">{error}</div>}
        <div className="field">
          <label>Skills I can teach</label>
          <TagInput value={offered} onChange={setOffered} placeholder="e.g. Web Development, Guitar" />
        </div>
        <div className="field">
          <label>Skills I want to learn</label>
          <TagInput value={wanted} onChange={setWanted} teal placeholder="e.g. Graphic Design, Spanish" />
        </div>
        <div className="d-flex gap-2 mt-4">
          <button className="btn-app btn-primary-app" disabled={saving}>
            {saving ? 'Saving…' : 'Save and find matches'}
          </button>
          <Link to="/profile" className="btn-app btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
