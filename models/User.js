const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  storeLink: {
    type: String,
    required: true
  },
  store: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  collection_link: {
    type: String,
    required: true
  },
  /*
  paid: {
    type: Boolean,
    required: true
  },
  doneSurvey: {
    type: Boolean,
    required: true
  },
  doneLabel: {
    type: Boolean,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  LabelResult:{
    image_id:{
      type: String,
      required: false
    },
    keyword:{
      keywords_1:{
        type: String,
        required: false
      },
      keywords_2:{
        type: String,
        required: false
      },
      keywords_3:{
        type: String,
        required: false
      }
    },
    section:{
      type: String,
      required: false
    },
    style:{
      type: String,
      required: false
    }
  }*/
});

module.exports = User = mongoose.model("users", UserSchema);
