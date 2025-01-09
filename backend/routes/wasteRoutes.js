const express = require("express");
const {
  addWaste,
  deleteWaste,
  updateWaste,
  getAllWastes,
} = require("../controllers/wasteController");

const router = express.Router();

router.post("/add", addWaste);
router.delete("/delete/:wasteId", deleteWaste);
router.put("/update/:wasteId", updateWaste);
router.get("/all", getAllWastes);

module.exports = router;
