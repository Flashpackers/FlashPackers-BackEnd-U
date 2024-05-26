const Customer = require("../models/customer");

const addCustomer = async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        const customer = new Customer({ name, email, phoneNumber });
        const result = await customer.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { name, email, phoneNumber } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, { name, email, phoneNumber }, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const deletedCustomer = await Customer.findByIdAndDelete(customerId);
        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCustomerList = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addFavouriteMenuItem = async (req,res)=>{
    try {
        const { customerId } = req.params;
        const { menuItemId } = req.body;
        
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const menuItemExists = customer.favouriteItems.some(item => item.menuItem.toString() === menuItemId);

        if (menuItemExists) {
            return res.status(200).json({ message: 'Menu item already added as favorite' });
        }

        customer.favouriteItems.push({ menuItem: menuItemId });
        const updatedCustomer = await customer.save();
        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:'Internal Server Error'});
    }
}
const removeFavouriteMenuItem = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { menuItemId } = req.body;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const menuItemIndex = customer.favouriteItems.findIndex(item => item.menuItem.toString() === menuItemId);

        if (menuItemIndex === -1) {
            return res.status(404).json({ error: 'Menu item not found in favorites' });
        }

        customer.favouriteItems.splice(menuItemIndex, 1);
        const updatedCustomer = await customer.save();
        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { addCustomer, updateCustomer, deleteCustomer, getCustomerList, getCustomerById,addFavouriteMenuItem,removeFavouriteMenuItem };
