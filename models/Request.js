const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RequestSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  requested_style_url: {
    type: String,
    required: true
  },
  requested_product_urls: {
    type: Array,
    required: true
  },
  delivered_details: {
    type: Boolean,
    required: false
  },
  detail_link: {
    type: String,
    required: false
    }
});

module.exports = RequestProducts = mongoose.model("request_products", RequestSchema);
