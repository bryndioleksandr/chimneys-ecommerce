import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
        productCode: {
            type: String,
            required: true,
            unique: true,
        },
        name: {type: String, required: true},
        description: {type: String},
        price: {type: Number, required: true},
        discount: {type: Number},
        images: [{type: String}],
        category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
        subcategory: {type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory'},
        stock: {type: Number, default: 0},
        rating: {type: Number, default: 0},
        reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
    },
    {timestamps: true},
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
