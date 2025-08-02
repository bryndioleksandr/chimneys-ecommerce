import mongoose from "mongoose";

const StaticPageSchema = new mongoose.Schema({
    slug: { type: String, unique: true }, // напр. "payment-delivery"
    title: String,                        // напр. "Оплата і доставка"
    content: String,                      // HTML або Markdown
    updatedAt: { type: Date, default: Date.now }
});

const StaticPage = mongoose.model("StaticPage", StaticPageSchema);
export default StaticPage;
