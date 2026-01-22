import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
        productCode: {
            type: String,
            required: true,
            unique: true,
        },
        groupId: {type: String, index: true},

        basId: {type: String, index: true, unique: true},
        basGroup: {type: String},
        groupBasId: {type: String},

        slug: {type: String, unique: true},
        name: {type: String, required: true},
        description: {type: String},
        price: {type: Number, required: true},
        discountedPrice: {type: Number, required: false},
        discount: {type: Number, default: 0},
        images: [{type: String}],
        category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
        subCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory'},
        subSubCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'SubSubCategory'},
        steelGrade: {type: String, required: false},
        thickness: {type: Number, required: false},
        diameter: {type: Number, required: false},
        length: {type: Number, required: false},
        weight: {type: Number, required: false},

        angle: {type: Number, enum: [30, 45, 60, 90], default: null},
        revision: {type: Boolean, default: false},
        hasMesh: {type: Boolean, default: false},
        insulationThickness: {type: Number, required: false},
        customAttributes: {type: Map, of: String},
        stock: {type: Number, default: 0},
        purchaseCount: {type: Number, default: 0},
        rating: {type: Number, default: 0},
        reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
    },
    {timestamps: true},
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
