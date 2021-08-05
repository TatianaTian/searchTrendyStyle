const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StyleButtonSchema = new Schema({
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
  }
});

module.exports = StyleButton = mongoose.model("style_button", StyleButtonSchema);
