import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId || null, ref: 'User', required: false },
    phoneNumber: { type: String, required: true },
    deliveryWay: {
        type: String,
        enum: ['nova_poshta_branch', 'nova_poshta_courier', 'ukrposhta', 'pickup'],
        default: 'nova_poshta_branch',
        required: true
    },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1, min:1 }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'], default: 'pending' },
    city: {type: String, required: true},
    postalCode: {type: String, required: false},
    address: { type: String, required: true },
    paymentMethod: {
        type: String,
        enum: ['liqpay', 'on_delivery_place', 'bank_transfer'],
        default: 'liqpay',
        required: true
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentInfo: {
        paymentId: { type: Number },
        liqpayOrderId: { type: String },
        liqpayStatus: { type: String },
        transactionId: { type: Number },
        amount: { type: Number },
        currency: { type: String },
        payType: { type: String },
        action: { type: String },
        description: { type: String },
        senderName: { type: String },
        senderCardType: { type: String },
        senderCardBank: { type: String },
        amountCredit: { type: Number },
        receiverCommission: { type: Number },
        createdAt: { type: Date },
        endedAt: { type: Date }
    }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
