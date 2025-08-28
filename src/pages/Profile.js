import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found");
          logout();
          return; 
        }

        const res = await axios.get(`/api/users/profile/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        if (err.response && err.response.status === 401) {
          logout();
          navigate("/login");
        }
      }
    };

    if (user?._id) fetchProfile();
  }, [user, logout, navigate]);

  return (
    <div className="profile-outer">
      <div className="profile-box">
        <h1>Profile Page</h1>
        {!user ? (
          <p style={{ color: "red", textAlign: "center" }}>⚠️ User not logged in</p>
        ) : profile ? (
          <div>
            <h3>Name: {profile.name}</h3>
            <p>Email: {profile.email}</p>
            <p>Skills Offered: {profile.skillsOffered?.join(", ") || "None"}</p>
            <p>Skills Wanted: {profile.skillsWanted?.join(", ") || "None"}</p>
            <button onClick={() => navigate("/edit-profile")}>Edit</button>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
