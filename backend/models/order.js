import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId || null, ref: 'User', required: false },
    phoneNumber: { type: String, required: true },
    deliveryWay: {
        type: String,
        enum: ['nova_poshta_branch', 'nova_poshta_courier', 'ukrposhta', 'pickup'],
        default: 'nova_poshta_branch',
        required: true
    },    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1, min:1 }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'], default: 'processing' },
    country: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    address: { type: String, required: true }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
