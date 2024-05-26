const express = require("express");
const router = express.Router();
const menu = require("../../controllers/menu");

router.route("/listMenu").get(menu.getMenuList); 
router.route("/addMenu").post(menu.addMenu);

router.route("/getMenuById/:itemId").get(menu.getMenuById);
router.route("/getMenuByName/:itemName").get(menu.getMenuByName);
router.route("/getMenuTypes").get(menu.getMenuTypes);
router.route("/getMenuFromType/:type").get(menu.getMenuFromType);
router.route("/getMenuByArray").post(menu.getMenuByArray);
router.route("/getMenuByObject").post(menu.getMenuByObject);

router.route("/deleteMenu/:itemId").delete(menu.deleteMenu);
router.route("/updateView/:itemId").get(menu.updateMenuView);
router.route("/update/:itemId").post(menu.updateMenu);
router.route("/addFromCSV").get(menu.addFromCsv);
router.route("/getEnumValues").get(menu.getEnumValues);

module.exports = router;
