const mongoose = require("mongoose");

const WasteSchema = new mongoose.Schema({
  typeOfWaste: {
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Waste = mongoose.model("Waste", WasteSchema);

module.exports = Waste;
