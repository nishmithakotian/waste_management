const express = require("express");
const {
  registerUser,
  loginUser,
  getSingleUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getSingleUser);

module.exports = router;
