const express = require("express");
const router = express.Router();
const { getOrderList, addOrder,orderHistory } = require("../../controllers/order");

router.route("/listOrders").get(getOrderList);
router.route("/addOrder").post(addOrder);
router.route("/orderHistory").post(orderHistory);

module.exports = router;
