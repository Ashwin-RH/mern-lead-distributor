const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Lead = require("../models/Lead");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const agentCount = await User.countDocuments({ role: 'agent' }); //filtering only agents
    const leadCount = await Lead.countDocuments();

    res.json({ agentCount, leadCount });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
