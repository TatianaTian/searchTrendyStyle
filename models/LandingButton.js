const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LandingButtonSchema = new Schema({
  gender: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  }
});

module.exports = LandingButton = mongoose.model("landing_button", LandingButtonSchema);
