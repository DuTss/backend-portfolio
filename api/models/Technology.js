const mongoose = require("mongoose");

const TechnologySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, default: "other" },
  color: { type: String, default: "#000000" },
  iconName: { type: String, default: "" },
  websiteUrl: { type: String, default: "" },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Technology", TechnologySchema);