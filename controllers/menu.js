const Menu = require("../models/menu");
const fs = require("fs");
const csv = require("csv-parser");

const getMenuList = async (req, res) => {
  try {
    const menuItems = await Menu.find();

    res.status(200).json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addFromCsv = async (req, res) => {
  try {
    const filePath =
      "C:\\Users\\ud301\\OneDrive\\Desktop\\Flashpackers\\final.csv";

    const stream = fs.createReadStream(filePath);
    const menuItems = [];

    stream
      .pipe(csv())
      .on("data", (row) => {
        menuItems.push({
          name: row.Name,
          price: parseFloat(row.Price),
          description: row.Description,
          type: row.Type,
          subtype: row.Subtype,
          image: row.Image,
          category: row.Category,
        });
      })
      .on("end", async () => {
        try {
          // Use insertMany to add all menu items in a single operation
          const results = await Menu.insertMany(menuItems);

          res.status(201).json(results);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addMenu = async (req, res) => {
  try {
    console.log(req.body);
    const menuItem = new Menu(req.body);
    const result = await menuItem.save();
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMenuById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const menuItem = await Menu.findById(itemId);

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMenuByName = async (req, res) => {
  try {
    const { itemName } = req.params;
    const menuItem = await Menu.findOne({ name: itemName });

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await Menu.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMenuView = async (req, res) => {
  try {
    const { itemId } = req.params;
    const menuItem = await Menu.findById(itemId);

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.render("updateForm", { menuItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMenu = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updatedMenu = req.body;
    const result = await Menu.findByIdAndUpdate(itemId, updatedMenu, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMenuTypes = async (req, res) => {
  try {
    const menuTypes = await Menu.distinct("type");
    res.status(200).json(menuTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getMenuFromType = async (req, res) => {
  try {
    const { type } = req.params;
    const subtypes = await Menu.distinct("subtype", { type: type }).sort({
      subtype: 1,
    });
    const menuItemsBySubtype = {};
    for (const subtype of subtypes) {
      const menuItems = await Menu.find({
        type: type,
        subtype: subtype,
      }).select("-__v -createdAt -updatedAt");
      menuItemsBySubtype[subtype] = menuItems;
    }
    const responseData = {
      subtypes: subtypes,
      menuItemsBySubtype: menuItemsBySubtype,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getEnumValues = (req, res) => {
  const enumValues = {
    types: Menu.schema.path("type").enumValues,
    subtypes: Menu.schema.path("subtype").enumValues,
  };
  res.status(200).json(enumValues);
};
const getMenuByArray = async (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({
        error:
          "Menu item IDs must be provided as an array/Object in the request body",
      });
    }
    const items = req.body.items;
    const ItemCollection = await Menu.find({ _id: { $in: items } });

    if (ItemCollection.length === 0) {
      return res.status(404).json({ error: "No menu items found with the provided IDs" });
    }

    res.status(200).json(ItemCollection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getMenuByObject = async (req, res) => {
  try {
    if (!req.body || typeof req.body.items !== "object" || Object.keys(req.body.items).length === 0) {
      return res.status(400).json({
        error: "Menu item IDs and quantities must be provided as a non-empty object in the request body",
      });
    }

    const items = Object.keys(req.body.items);
    const quantities = req.body.items;
    const ItemCollection = await Menu.find({ _id: { $in: items } });

    if (ItemCollection.length === 0) {
      return res.status(404).json({ error: "No menu items found with the provided IDs" });
    }

    const response = ItemCollection.map(item => ({
      ...item.toObject(),
      quantity: quantities[item._id] || 1, // Default quantity to 1 if not provided
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getMenuList,
  addMenu,
  getMenuById,
  getMenuByName,
  deleteMenu,
  updateMenuView,
  updateMenu,
  addFromCsv,
  getMenuTypes,
  getMenuFromType,
  getEnumValues,
  getMenuByArray,
  getMenuByObject
};
