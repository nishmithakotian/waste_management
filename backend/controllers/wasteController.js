const Waste = require("../models/wasteModel");
const User = require("../models/userModel");

// Add Waste
const addWaste = async (req, res) => {
  const {
    userId,
    typeOfWaste,
    longitude,
    latitude,
    contactNumber,
    image,
    description,
    user,
  } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new waste entry
    const newWaste = new Waste({
      typeOfWaste,
      longitude,
      latitude,
      contactNumber,
      image,
      description,
      user,
    });
    await newWaste.save();

    // Link the waste to the user
    user.wastes.push(newWaste._id);
    await user.save();

    res
      .status(201)
      .json({ message: "Waste added successfully", waste: newWaste });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding waste", error: error.message });
  }
};

// Delete Waste
const deleteWaste = async (req, res) => {
  const { wasteId } = req.params;

  try {
    // Find the waste entry
    const waste = await Waste.findById(wasteId);
    if (!waste) {
      return res.status(404).json({ message: "Waste not found" });
    }

    // Remove the waste from the associated user
    await User.updateOne({ wastes: wasteId }, { $pull: { wastes: wasteId } });

    // Delete the waste entry
    await Waste.findByIdAndDelete(wasteId);

    res.status(200).json({ message: "Waste deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting waste", error: error.message });
  }
};

// Update Waste
const updateWaste = async (req, res) => {
  const { wasteId } = req.params;
  const { typeOfWaste, longitude, latitude, contactNumber, image } = req.body;

  try {
    // Find and update the waste entry
    const updatedWaste = await Waste.findByIdAndUpdate(
      wasteId,
      { typeOfWaste, longitude, latitude, contactNumber, image },
      { new: true }
    );

    if (!updatedWaste) {
      return res.status(404).json({ message: "Waste not found" });
    }

    res
      .status(200)
      .json({ message: "Waste updated successfully", waste: updatedWaste });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating waste", error: error.message });
  }
};

// Get All Wastes
const getAllWastes = async (req, res) => {
  try {
    // Fetch all wastes
    const wastes = await Waste.find().populate("user");
    res.status(200).json({ wastes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching wastes", error: error.message });
  }
};

module.exports = {
  addWaste,
  deleteWaste,
  updateWaste,
  getAllWastes,
};
