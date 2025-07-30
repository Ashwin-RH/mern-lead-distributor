const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  firstName: String,
  mobile: String,
  notes: String,
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Lead", leadSchema);
