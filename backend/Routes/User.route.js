const express = require("express");
const router = express.Router();

const {
	RegisterUser,
	LoginUser,
	UserDetails,
	findUserDetails,
} = require("../controllers/Users");

router.post("/login", LoginUser);

router.post("/register", RegisterUser);

router.get("/user", UserDetails);

router.get("/user/:id", findUserDetails);

// export these routes
module.exports = router;
