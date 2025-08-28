import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';


const Matches = () => {
  const { id } = useParams();
  const [matchUser, setMatchUser] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/users/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatchUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchUser();
}, [id]);

  if (!matchUser) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <h2>{matchUser.name}</h2>
      <p><strong>Offers:</strong> {matchUser.skillsOffered.join(', ')}</p>
      <p><strong>Wants:</strong> {matchUser.skillsWanted.join(', ')}</p>
      {/* Optional: Chat button, contact, etc. */}
    </div>
  );
};

export default Matches;
