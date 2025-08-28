import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./EditProfile.css";

const EditProfile = () => {
  const { user } = useContext(AuthContext);  
  const [skillsOffered, setSkillsOffered] = useState("");  
  const [skillsWanted, setSkillsWanted] = useState("");

  useEffect(() => { 
    const fetchCurrentSkills = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/users/profile/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSkillsOffered(res.data.skillsOffered?.join(", ") || "");
        setSkillsWanted(res.data.skillsWanted?.join(", ") || "");
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };

    if (user?._id) fetchCurrentSkills();                                         
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/users/skills/${user._id}`,
        {
          skillsOffered: skillsOffered.split(",").map((s) => s.trim()),
          skillsWanted: skillsWanted.split(",").map((s) => s.trim()),       
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );   

      alert("✅ Skills updated successfully!");
    } catch (err) {
      console.error("Error updating skills:", err);
      alert("❌ Failed to update skills");
    }
  };

  return (
    <div className="editprofile-outer">
      <div className="editprofile-box">
        <h1>Edit Your Skills</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Skills Offered (comma separated): </label>
            <input
              type="text"
              value={skillsOffered}
              onChange={(e) => setSkillsOffered(e.target.value)}
              placeholder="e.g. Web Development, Video Editing"
            />
          </div>
          <div>
            <label>Skills Wanted (comma separated):</label>
            <input
              type="text"
              value={skillsWanted}
              onChange={(e) => setSkillsWanted(e.target.value)}
              placeholder="e.g. Graphic Design, SEO"
            />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
