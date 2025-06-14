const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookNowSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  members: {
    type: Number,
    required: true,
    min: 1
  },
  memberNames: [{
    type: String,
    required: true
  }],
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > new Date(); 
      },
      message: props => `Booking date (${props.value.toDateString()}) must be in the future.`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BookNow = mongoose.model("BookNow", bookNowSchema);
module.exports = BookNow;
