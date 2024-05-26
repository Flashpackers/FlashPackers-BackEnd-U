const express = require("express");
const router = express.Router();
const { addCustomer, getCustomerList, getCustomerById, updateCustomer, deleteCustomer, addFavouriteMenuItem,removeFavouriteMenuItem } = require("../../controllers/customer");

router.route("/addCustomer").post(addCustomer);
router.route("/listCustomers").get(getCustomerList);
router.route("/getCustomerById/:customerId").get(getCustomerById);
router.route("/updateCustomer/:customerId").put(updateCustomer);
router.route("/deleteCustomer/:customerId").delete(deleteCustomer);
router.route("/addFavouriteItem/:customerId").post(addFavouriteMenuItem);
router.route("/removeFavouriteItem/:customerId").post(removeFavouriteMenuItem);
module.exports = router;
