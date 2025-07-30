# MERN Lead Distributor

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for lead distribution and agent management.

## 🚀 Features

- ✅ **Admin Login** (JWT-authenticated)
- ✅ **Agent Creation & Management**
- ✅ **CSV Upload & Validation**
- ✅ **Automatic Lead Distribution** to 5 agents (equal + remainder logic)
- ✅ **MongoDB Storage** of agents and leads
- ✅ **Responsive Dashboard** for admins and agents

## 📂 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios, React Toastify
- **Backend:** Node.js, Express.js, Multer, JWT
- **Database:** MongoDB (Mongoose ODM)

## 🧠 Lead Distribution Logic

- Admin uploads a CSV file with:
  - FirstName (Text)
  - Phone (Number)
  - Notes (Text)
- Leads are equally distributed among available agents.
- Remainder leads (if any) are distributed sequentially.
- Each agent’s assigned leads are stored in the database.

## ✅ File Upload Validation

- Accepts only `.csv`, `.xlsx`, `.xls` formats
- Validates each row before saving
-  Auth-based route protection (adminOnly middleware)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Ashwin-RH/mern-lead-distributor.git
cd mern-lead-distributor
```
### 2. Backend Setup

```bash
cd backend
npm install

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

npm run dev
```

### 3. Frontend Setup

```bash
cd mern-agent-frontend
npm install
npm run dev
```

### Folder Structure

```bash
mern-lead-distributor/
│
├── backend/
│   ├── models/         # User, Agent, Lead
│   ├── routes/         # Auth, Agents, Leads
│   ├── middleware/     # authMiddleware.js
│   ├── uploads/        # Multer file uploads
│   └── server.js       # Entry point
│
├── mern-agent-frontend/
│   ├── src/
│   │   ├── pages/       # Login, Dashboard, AddAgent
│   │   ├── components/  # Shared components
│   │   └── App.jsx
│   └── tailwind.config.js
│
└── README.md
```
### Example CSV Format

```bash
firstName,phone,notes
John Doe,9876543210,Interested in product A
Jane Smith,9123456789,Needs follow-up
```



