import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    image: { type: String, required: true },
    alt: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

export const Banner = mongoose.model("Banner", bannerSchema);
