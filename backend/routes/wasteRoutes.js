const express = require("express");
const {
  addReportedWaste,
  addSellWaste,
  deleteWaste,
  updateWaste,
  getReportedWastes,
  getSellWastes,
} = require("../controllers/wasteController");

const router = express.Router();

router.post("/report", addReportedWaste);
router.post("/sell", addSellWaste);
router.delete("/delete/:wasteId", deleteWaste);
router.put("/update/:wasteId", updateWaste);
router.get("/report", getReportedWastes);
router.get("/sell", getSellWastes);

module.exports = router;
