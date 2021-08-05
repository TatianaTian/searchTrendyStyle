const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LeadSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
      },
    url: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    test: {
        type: Boolean,
        required: true
    },
    channel: {        
        type: String,
        required: true
    },
    review_example:{
        type: Boolean,
        required: true
    },
    review_example_button:{
        type: String,
        required: true
    },
    AS_example:{
        type: Boolean,
        required: true
    },
    AS_example_button:{
        type: String,
        required: true
    },
    init_signup:{
        type: Boolean,
        required: true
    },
    init_go_premium:{
        type: Boolean,
        required: true
    },
    signup_button:{
        type: String,
        required: true
    },
    go_premium_button:{
        type: String,
        required: true
    },
    NPS_score:{
        type: String,
        required: true
    },
    NPS_reason:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    click_survey:{
        type: Boolean,
        required: true
    },
    click_survey_button:{
        type: String,
        required: true
    },
    crash_no:{
        type: Number,
        required: true
    },
    crashed_link:{
        type: Boolean,
        required: true
    },
    reached_results:{
        type: Boolean,
        required: true
    }
});

module.exports = Lead = mongoose.model("leads", LeadSchema);
