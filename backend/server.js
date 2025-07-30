const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// ✅ CORS setup — allow frontend domain
const allowedOrigins = [
  'https://azyn.vercel.app',
  'https://agenzly.vercel.app',
  'https://mern-lead-distributor.vercel.app',
  'https://vercel.com/ashwin-haragis-projects/mern-lead-distributor/Avi6Nor35ztKxCypbieRVFevraH6',
  'http://localhost:5173',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(express.json());

// ✅ API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/summary', require('./routes/summary'));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB error:', err));

// ✅ Home route
app.get('/', (req, res) => {
  res.send("🤖 Hello, human. Azyn is online and distributing leads with precision and zero coffee.");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
🚀 AZYN Backend Deployed!
────────────────────────────────────────────
📍 Live URL     : https://azyn.onrender.com
🏷️  Tagline     : Organize. Assign. Grow.
🧠  Status       : Smart lead distribution is online.
🌿  Environment  : ${process.env.NODE_ENV || 'development'}
📡 Listening on : Port ${PORT}
────────────────────────────────────────────
`);
});
