import mongoose from "mongoose";

const FavoritesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });

const Favorites = mongoose.models.Favorites || mongoose.model("Favorites", FavoritesSchema);
export default Favorites;
