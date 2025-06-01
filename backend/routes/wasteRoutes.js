const express = require("express");
const {
  addReportedWaste,
  addSellWaste,
  deleteWaste,
  updateWaste,
  getReportedWastes,
  getSellWastes,
} = require("../controllers/wasteController");

const {
  checkWaste,
  wasteType,
} = require("../controllers/llmController");

const router = express.Router();

router.post("/report", addReportedWaste);
router.post("/sell", addSellWaste);
router.delete("/delete/:wasteId", deleteWaste);
router.put("/update/:wasteId", updateWaste);
router.get("/report", getReportedWastes);
router.get("/sell", getSellWastes);
router.post("/check-waste", checkWaste);
router.post("/check-type", wasteType);


module.exports = router;
