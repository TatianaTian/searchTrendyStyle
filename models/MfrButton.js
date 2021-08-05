const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MfrButtonSchema = new Schema({
  brandName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
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
  },
  stylePicNumber: {
    type: Array,
    required: true
  },
  mfrNumber: {
    type: Array,
    required: true
  }
});

module.exports = MfrButton = mongoose.model("mfr_button", MfrButtonSchema);
