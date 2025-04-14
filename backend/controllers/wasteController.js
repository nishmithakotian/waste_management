const Waste = require("../models/wasteModel");
const User = require("../models/userModel");
const axios = require("axios");

const getAddressFromOSM = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "waste-tracker/1.0 (your@email.com)",
      },
    });
    const address = response.data.address;
    return (
      (address.suburb || address.neighbourhood || '') + ", " +
      (address.city || address.town || address.state || '') + ", " +
      (address.country || '')
    );
  } catch (error) {
    console.error("Error fetching address:", error.message);
    return "Unknown Location";
  }
};

//Add reported Waste
const addReportedWaste = async (req, res) => {
  const { userId, typeOfWaste, longitude, latitude, contactNumber, image, description, status } = req.body;
  try{
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const location = await getAddressFromOSM(latitude, longitude);
    const newWaste = new Waste({
      typeOfWaste,
      longitude,
      latitude,
      location,
      contactNumber,
      image,
      description,
      userID: userId,
      status,
      category: 'report',
    });

    await newWaste.save();
    user.wastes.push(newWaste._id);
    await user.save();

    res.status(201).json({ message: "Reported waste added successfully", waste: newWaste });
  } catch(error){
    res.status(500).json({ message: "Error adding reported waste", error: error.message });
  }
}

// Add Sell Waste
const addSellWaste = async (req, res) => {
  const { userId, typeOfWaste, longitude, latitude, contactNumber, image, description, status, price } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const location = await getAddressFromOSM(latitude, longitude);

    const newWaste = new Waste({
      typeOfWaste,
      longitude,
      latitude,
      location,
      contactNumber,
      image,
      description,
      userID: userId,
      status,
      category: "sell",
      price,
    });

    await newWaste.save();
    user.wastes.push(newWaste._id);
    await user.save();

    res.status(201).json({ message: "Sell waste added", waste: newWaste });
  } catch (error) {
    res.status(500).json({ message: "Error adding sell waste", error: error.message });
  }
};

// Get Reported Wastes
const getReportedWastes = async (req, res) => {
  try {
    const wastes = await Waste.find({ category: "report" }).populate("userID");
    res.status(200).json({ wastes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reported wastes", error: error.message });
  }
};

// Get Sell Wastes
const getSellWastes = async (req, res) => {
  try {
    const wastes = await Waste.find({ category: "sell" }).populate("userID");
    res.status(200).json({ wastes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sell wastes", error: error.message });
  }
};
 
const updateWaste = async (req, res) => {
  const { wasteId } = req.params;
  const updateData = req.body;

  try {
    const waste = await Waste.findById(wasteId);
    if (!waste) {
      return res.status(404).json({ message: "Waste not found" });
    }

    Object.assign(waste, updateData); // apply updates
    await waste.save();

    res.status(200).json({ message: "Waste updated", waste });
  } catch (error) {
    res.status(500).json({ message: "Error updating waste", error: error.message });
  }
};

const deleteWaste = async (req, res) => {
  const { wasteId } = req.params;

  try {
    const waste = await Waste.findById(wasteId);
    if (!waste) {
      return res.status(404).json({ message: "Waste not found" });
    }

    await Waste.findByIdAndDelete(wasteId);
    await User.updateOne({ wastes: wasteId }, { $pull: { wastes: wasteId } });

    res.status(200).json({ message: "Waste deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting waste", error: error.message });
  }
};



// // Add Waste
// const addWaste = async (req, res) => {
//   const {
//     userId,
//     typeOfWaste,
//     longitude,
//     latitude,
//     contactNumber,
//     image,
//     description,
//     userID,
//     status,
//     category,
//   } = req.body;

//   try {
//     // Check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const location = await getAddressFromOSM(latitude, longitude);

//     // Create a new waste entry
//     const newWaste = new Waste({
//       typeOfWaste,
//       longitude,
//       latitude,
//       location,
//       contactNumber,
//       image,
//       description,
//       userID,
//       status,
//       category,
//     });
//     await newWaste.save();

//     // Link the waste to the user
//     user.wastes.push(newWaste._id);
//     await user.save();

//     res
//       .status(201)
//       .json({ message: "Waste added successfully", waste: newWaste });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error adding waste", error: error.message });
//   }
// };

// // Delete Waste
// const deleteWaste = async (req, res) => {
//   const { wasteId } = req.params;

//   try {
//     // Find the waste entry
//     const waste = await Waste.findById(wasteId);
//     if (!waste) {
//       return res.status(404).json({ message: "Waste not found" });
//     }

//     // Remove the waste from the associated user
//     await User.updateOne({ wastes: wasteId }, { $pull: { wastes: wasteId } });

//     // Delete the waste entry
//     await Waste.findByIdAndDelete(wasteId);

//     res.status(200).json({ message: "Waste deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error deleting waste", error: error.message });
//   }
// };

// // Update Waste
// const updateWaste = async (req, res) => {
//   const { wasteId } = req.params;
//   const { typeOfWaste, longitude, latitude, contactNumber, image, status } =
//     req.body;

//   try {
//     // Find and update the waste entry
//     const updatedWaste = await Waste.findByIdAndUpdate(
//       wasteId,
//       { typeOfWaste, longitude, latitude, contactNumber, image, status },
//       { new: true }
//     );

//     if (!updatedWaste) {
//       return res.status(404).json({ message: "Waste not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Waste updated successfully", waste: updatedWaste });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating waste", error: error.message });
//   }
// };

// Get All Wastes
// const getAllWastes = async (req, res) => {
//   try {
//     // Fetch all wastes
//     const wastes = await Waste.find().populate("userID");
//     res.status(200).json({ wastes });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching wastes", error: error.message });
//   }
// };

module.exports = {
  addReportedWaste,
  addSellWaste,
  deleteWaste,
  updateWaste,
  getReportedWastes,
  getSellWastes,
};
