// routes/agents.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth'); // make sure this is applied correctly

router.post('/', auth, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check if agent already exists by email or mobile
    const existingAgent = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingAgent) {
      return res.status(400).json({ msg: 'Agent with same email or mobile already exists' });
    }

    const newUser = new User({
      name,
      email,
      mobile,
      password,
      role: 'agent', // Set role to 'agent' 
      createdBy: req.user.id, // from auth middleware
    });
console.log(req.user) 

    await newUser.save();

    res.status(201).json({ msg: 'Agent created successfully' });
  } catch (err) {
    console.error("🔥 Server error creating agent:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
