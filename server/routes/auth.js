const {
  login,
  register,
  getAllUsers,
  getUsersByUsername,
  setAvatar,
  logOut,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.get("/users/:username", getUsersByUsername);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);

module.exports = router;
