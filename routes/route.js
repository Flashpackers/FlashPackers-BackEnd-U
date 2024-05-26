const express = require("express");
const router = express.Router();

// Import other route modules
const menuRoutes = require("./lib/menuRoutes");
const orderRoutes = require("./lib/orderRoutes");
const adminRoutes = require("./lib/adminRoutes");
const customerRoutes = require("./lib/customerRoutes");

router.use("/menu", menuRoutes);
router.use("/order", orderRoutes);
router.use("/admin", adminRoutes);
router.use("/customer", customerRoutes);

module.exports = router;
