const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Lead = require('../models/Lead');

// Multer setup
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv') return cb(new Error('Only CSV files are allowed'));
    cb(null, true);
  },
});

// Upload and distribute leads
router.post('/', authMiddleware, adminOnly, upload.single('file'), async (req, res) => {
  const filePath = req.file?.path;

  try {
    if (!filePath) return res.status(400).json({ msg: 'No file uploaded' });

    const agents = await User.find({ role: 'agent' });
    if (agents.length === 0) return res.status(400).json({ msg: 'No agents found' });

    const leads = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const FirstName = row.FirstName?.trim();
          const Mobile = row.Mobile?.trim();
          const Notes = row.Notes?.trim() || '';

          if (FirstName && Mobile) {
            leads.push({ firstName: FirstName, mobile: Mobile, notes: Notes });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Distribute leads to agents 
    const distributed = leads.map((lead, index) => {
      const agent = agents[index % agents.length];
      return { ...lead, agent: agent._id };
    });

    // Insert leads into DB
    const insertedLeads = await Lead.insertMany(distributed);

    // Group leads by agent
    const leadsByAgent = {};
    insertedLeads.forEach((lead) => {
      const agentId = lead.agent.toString();
      if (!leadsByAgent[agentId]) leadsByAgent[agentId] = [];
      leadsByAgent[agentId].push(lead._id);
    });

    // Update each agent’s assignedLeads field
    const updatePromises = Object.entries(leadsByAgent).map(([agentId, leadIds]) =>
      User.findByIdAndUpdate(
        agentId,
        { $push: { assignedLeads: { $each: leadIds } } },
        { new: true }
      )
    );
    await Promise.all(updatePromises);

    res.status(201).json({ msg: 'Leads distributed successfully', total: insertedLeads.length });
  } catch (err) {
    console.error('❌ CSV Upload Error:', err);
    res.status(500).json({ msg: 'Server error while processing CSV' });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Clean uploaded file
    }
  }
});

module.exports = router;
