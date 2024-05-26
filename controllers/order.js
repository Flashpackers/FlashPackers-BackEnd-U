const Order = require("../models/order");
const Menu = require("../models/menu");
const Customer = require('../models/customer');

const getOrderList = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer');
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const addOrder = async (req, res) => {
    try {
        const existingCustomer = await Customer.findOne({
            name: req.body.orderdetails.customerName,
            email: req.body.orderdetails.customerEmail,
            phoneNumber: req.body.orderdetails.customerPhoneNumber,
        });

        let customer;

        if (existingCustomer) {
            customer = existingCustomer;
        } else {
            const newCustomer = new Customer({
                name: req.body.orderdetails.customerName,
            email: req.body.orderdetails.customerEmail,
            phoneNumber: req.body.orderdetails.customerPhoneNumber,
            });

            customer = await newCustomer.save();
        }

        const orderItems = req.body.orderdetails.orderItems;

        const order = new Order({
            orderItems: orderItems,
            customer: customer._id,
        });

        const result = await order.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const orderHistory = async (req, res) => {
    try {
        const existingCustomer = await Customer.findOne({
            name: req.body.customerName,
            email: req.body.customerEmail,
            phoneNumber: req.body.customerPhoneNumber,
        });

        if (!existingCustomer) {
            return res.status(404).json({ error: "Invalid Customer" });
        }

        const orders = await Order.find({ customer: existingCustomer._id })
            .select('-createdAt -updatedAt')
            .lean();

        const menuItemIds = [...new Set(orders.flatMap(order => Object.keys(order.orderItems)))];
        const menuItems = await Menu.find({ _id: { $in: menuItemIds } }).lean();

        const transformedOrders = orders.map(order => {
            const transformedOrderItems = menuItems.map(item => {
                if (order.orderItems[item._id]) {
                    return {
                        id: item._id,
                        name: item.name,
                        image: item.image,
                        quantity: order.orderItems[item._id]
                    };
                }
                return null;
            }).filter(item => item !== null);

            return { ...order, orderItems: transformedOrderItems };
        });

        res.status(200).json(transformedOrders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getOrderList, addOrder, orderHistory };




module.exports = { getOrderList, addOrder,orderHistory };
