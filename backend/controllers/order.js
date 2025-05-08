import Order from "../models/order.js";

export const createOrder = async (req, res) => {
    try {
        const { user, phoneNumber, deliveryWay, products, totalPrice, country, city, postalCode, address } = req.body;

        const newOrder = new Order({
            user,
            phoneNumber,
            deliveryWay,
            products,
            totalPrice,
            country,
            city,
            postalCode,
            address
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user").populate("products.product");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("user").populate("products.product");

        if (!order) return res.status(404).json({ msg: "Order not found" });

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) return res.status(404).json({ msg: "Order not found" });

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) return res.status(404).json({ msg: "Order not found" });

        res.status(200).json({ msg: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).populate("products.product");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
