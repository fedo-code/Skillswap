# SkillSwap – Skill Sharing Platform

## 📖 Introduction
**SkillSwap** is a platform where users can **register, login, and update their profiles**.  
Users can list the **skills they offer** and the **skills they want**.  
If two users have a mutual match (Offer == Want and Want == Offer), the system automatically pairs them, allowing **chat and skill exchange**.  

This is a **MERN stack project** (MongoDB, Express.js, React.js, Node.js) with secure **JWT authentication**.  

---

##  Features
-  User Registration & Login (JWT Authentication)
-  Profile Update with Skills Offered & Wanted
-  Automatic Skill Matching System
-  Real-time Messaging between matched users
-  MongoDB for data storage
-  Responsive UI using React.js & Bootstrap
-  Password encryption using bcrypt.js
-  SPA Support for frontend (React + React Router)

---

## 🛠 Tech Stack
**Frontend:** React.js, React Router DOM, Axios, Bootstrap  
**Backend:** Node.js, Express.js, JWT, bcrypt.js, cors  
**Database:** MongoDB (Mongoose)  
**Hosting:** Render (Production)  

---


##  Installation & Setup


### 1️⃣ Clone the repository
bash
git clone https://github.com/fedo-code/Skillswap.git
cd myproject

Install dependencies
npm install

## ⚙️ Running the Project

### Local Development
- Backend: `server.js` (run with `npm run server`)  
- Frontend: React app (run with `npm run client`)  
  
  - Backend → http://localhost:5000  
  - Frontend → http://localhost:3000  

### Production / Render Deployment
- Backend + Frontend (React build) served via `render-server.js`  
- Run with: `npm run start-render`  
- This serves the React SPA along with all backend APIs on Render.com


## 🔗 Live Demo
[Click here to try SkillSwap](https://skillswap-co6l.onrender.com)