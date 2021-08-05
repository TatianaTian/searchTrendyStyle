const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  website: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  }
});

module.exports = Websites = mongoose.model("websites", UserSchema);
