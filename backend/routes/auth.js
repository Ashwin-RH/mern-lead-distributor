const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, mobile, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    console.log("Registering with password:", password); // log plain password

    const user = new User({
      name,
      email,
      password, //plain password schema will hash it
      mobile,
      role
    });

    await user.save();
    console.log("User saved. Hashed password:", user.password); // log hashed version

    res.status(201).json({ msg: 'Admin registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email, password); // 👈 Debug log

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user); // 👈 Debug log

    if (!user) {
      console.log("❌ No user found with that email");
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // 👈 Debug log

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
