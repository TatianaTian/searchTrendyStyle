const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

module.exports = WLUser = mongoose.model("wlusers", UserSchema);
