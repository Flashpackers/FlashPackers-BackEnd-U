const mongoose = require("mongoose");
const Menu = require("./menu");

const orderSchema = new mongoose.Schema(
  {
    orderItems: {
      type: Map,
      of: Number,
      required: true,
    },
    orderDateTime: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    totalAmount:{
      type: Number
    }
  },
  { timestamps: true }
);



orderSchema.pre("save", async function (next) {
  const orderItems = this.orderItems;

  for (const menuItemId of orderItems.keys()) {
    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      throw new Error(`Invalid menu item ID: ${menuItemId}`);
    }
  }
  let total = 0;
  for (const [menuItemId, quantity] of this.orderItems.entries()) {
    const menuItem = await Menu.findById(menuItemId);
    if (menuItem) {
      total += menuItem.price * quantity;
    }
  }
  this.totalAmount = total; 
  next();
});


const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
