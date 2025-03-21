const express = require("express");
const { registerDriver, registerOwner, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register/driver", registerDriver);
router.post("/register/owner", registerOwner);
router.post("/login", loginUser);

module.exports = router;
