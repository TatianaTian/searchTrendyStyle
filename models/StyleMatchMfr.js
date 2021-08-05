const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StyleMatchMfrSchema = new Schema({
  img_key: {
    type: String,
    required: true
  },
  style1: {
    url: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    moq: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  style2: {
    url: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    moq: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  style3: {
    url: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    moq: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  style4: {
    url: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    moq: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  style5: {
    url: {
      type: String,
      required: true
    },
    price: {
      type: Number, 
      required: true
    },
    moq: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  style6: {
    url: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    moq: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
});

module.exports = StyleMatchMfr = mongoose.model("style_match_mfr", StyleMatchMfrSchema);
