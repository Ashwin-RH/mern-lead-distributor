const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const Lead = require('../models/Lead');
const User = require('../models/User');
const csv = require('csvtojson');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// @route   POST /api/leads/upload
router.post(
  '/upload',
  authMiddleware,
  adminOnly,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

      const jsonArray = await csv().fromFile(req.file.path);

      // Fetch all agents
      const agents = await User.find({ role: 'agent' });

      if (agents.length === 0) {
        return res.status(400).json({ msg: 'No agents available' });
      }

      const totalLeads = jsonArray.length;
      const chunkSize = Math.floor(totalLeads / agents.length);
      let remainder = totalLeads % agents.length;

      let idx = 0;
      for (let agent of agents) {
        const count = chunkSize + (remainder > 0 ? 1 : 0);
        remainder--;

        const chunk = jsonArray.slice(idx, idx + count);
        idx += count;

        const leads = chunk.map((item) => ({
          firstName: item.firstName,
          phone: item.phone,
          notes: item.notes,
          agent: agent._id,
        }));

        await Lead.insertMany(leads);
      }

      res.json({ msg: 'Leads distributed successfully', total: totalLeads });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ msg: 'Server error during upload' });
    }
  }
);

// @route   GET /api/leads
// @desc    Get leads for current user (admin gets all, agent gets own)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? {} // admin gets all
      : { agent: req.user.id }; // agent gets only their leads

    const leads = await Lead.find(query).populate('agent', 'name email');
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/leads/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ msg: "Lead not found" });

    // Optional: restrict deletion only to the agent who owns it or admin
    const user = req.user;
    if (user.role !== 'admin' && lead.agent.toString() !== user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this lead" });
    }

    await lead.deleteOne();
    res.json({ msg: "Lead deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting lead:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



module.exports = router;
