import Order from "../models/order.js";
import Product from "../models/product.js";

export const createOrder = async (req, res) => {
    try {
        const { user, phoneNumber, paymentMethod, deliveryWay, products, totalPrice, city, postalCode, address } = req.body;

        const newOrder = new Order({
            user,
            phoneNumber,
            paymentMethod,
            deliveryWay,
            products,
            totalPrice,
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

        if (status === 'delivered') {
            for (const item of updatedOrder.products) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { purchaseCount: item.quantity }
                });
            }

            await updatedOrder.save();
        }

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

export const getOrdersByStatus = async(req, res) => {
    try{
        const { status } = req.params;
        const orders = await Order.find({ status }).populate("user").populate("products.product");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

export const getPaidOrders = async(req, res) => {
    try{
        const { isPaid } = req.params;
        const orders = await Order.find({ isPaid }).populate("user").populate("products.product");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

// export const getOrdersByStatusCount = async(req, res) => {
//     try{
//         const { status } = req.params;
//         const orders = await Order.find({ status }).;
//         res.status(200).json(orders);
//     } catch (err) {
//         res.status(500).json({ msg: err.message });
//     }
// }

