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
        subCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory'},
        subSubCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'SubSubCategory'},
        steelGrade: { type: String }, // Марка сталі (наприклад, AISI 304, 321)
        thickness: { type: Number, required: false }, // Товщина сталі в мм
        diameter: { type: Number, required: false }, // Діаметр труби в мм
        length: { type: Number }, // Довжина в мм (якщо актуально)
        weight: { type: Number }, // Вага виробу в кг (за потреби)

        // Додаткові характеристики (для певних типів товарів)
        angle: { type: Number, enum: [30, 45, 60, 90], default: null }, // Кут (для колін, трійників)
        revision: { type: Boolean, default: false }, // Ревізія (так/ні)
        hasMesh: { type: Boolean, default: false }, // наявність сітки (для дефлекторів)
        insulationThickness: { type: Number }, // товщина утеплювача (для двостінних виробів)
        customAttributes: { type: Map, of: String }, // додаткові параметри у форматі ключ-значення
        stock: {type: Number, default: 0},
        rating: {type: Number, default: 0},
        reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
    },
    {timestamps: true},
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
