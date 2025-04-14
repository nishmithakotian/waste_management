const mongoose = require("mongoose");

const WasteSchema = new mongoose.Schema({
  typeOfWaste: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Optional if not every waste entry has an image
  },
  description: {
    type: String,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ['report', 'sell'],
    required: true,
  },
  price: {
    type: Number,
    required: function () {
      return this.category === 'sell';
    },
  },
});

const Waste = mongoose.model("Waste", WasteSchema);

module.exports = Waste;
