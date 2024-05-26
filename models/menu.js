const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    type:{
      type:String,
      required: true,
      enum: {
        values: ["Breakfast & Pancakes", "Beverages", "Chapati and Paratha","Desserts","Main Course","Pasta","Meals","Sandwiches & Rolls","Snacks & Starters","Rice & Noodles"],
        message: `{VALUE} is different than expacted`,
      },
    },
    subtype:{
      type:String,
      required: true,
      enum: {
        values: ["Brownie", "Cake", "Chapati","Coolers","Coffees & Hot Drinks","Eggs & Omelettes","Healthy and filling","Maggi","Meals","Noodles","Non-Vegetarian","Parathas","Pancakes","Pasta","Rice","Rolls","Snacks & Starters","Sandwiches","Soup","Shakes","Toast/bread","Teas","Vegetarian"],
        message: `{VALUE} is different than expacted`,
      },
    },
    image:{
      type:String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ["Veg", "NonVeg", "Egg"],
        message: `{VALUE} is different than expacted`,
      },
    },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;