const express = require("express");
const router = express.Router();
const { addAdmin,getAdmin, login, verifyToken} = require("../../controllers/admin");

router.route("/addAdmin").post(addAdmin);
router.route("/loginAuth").post(login);
router.route("/verifyUser").post(verifyToken);
router.route("/getAdmin/:email").get(getAdmin);

module.exports = router;
