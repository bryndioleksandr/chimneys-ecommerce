import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import Product from "../models/product.js";
import slugify from "slugify";
import mongoose from "mongoose";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createProduct = async (req, res) => {
    try {
        upload.array("images", 5)(req, res, async (err) => {
            if (err) return res.status(400).json({ msg: "Error uploading files" });

            if (!req.body.subCategory) req.body.subCategory = null;
            if (!req.body.subSubCategory) req.body.subSubCategory = null;
            const productData = req.body;
            console.log('images received:', req.body.images);
            console.log('files received:', req.files);
            productData.slug = slugify(productData.name, { lower: true });
            console.log('product data is:', productData);
            let uploadedImages = [];

            if (req.files && req.files.length > 0) {
                try {
                    for (const file of req.files) {
                        const result = await new Promise((resolve, reject) => {
                            const stream = cloudinary.uploader.upload_stream(
                                { folder: "products" },
                                (error, result) => (error ? reject(error) : resolve(result))
                            );
                            stream.end(file.buffer);
                        });
                        uploadedImages.push(result.secure_url);
                    }
                } catch (uploadError) {
                    return res.status(500).json({ msg: "Error uploading images" });
                }
            }

            const newProduct = new Product({
                ...productData,
                images: uploadedImages,
            });

            await newProduct.save();
            res.status(200).json(newProduct);
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const products = await Product.find({
            name: { $regex: query, $options: "i" }
        });
        console.log('results search are:', products);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate("category subCategory subSubCategory");
        if (!product) return res.status(404).json({ msg: "Product not found" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category subCategory subSubCategory");
        res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        upload.array("images", 5)(req, res, async (err) => {
            if (err) return res.status(400).json({ msg: "Error uploading files" });

            const { productId } = req.params;

            if (!req.body.subCategory) req.body.subCategory = null;
            if (!req.body.subSubCategory) req.body.subSubCategory = null;

            const updatedData = req.body;
            updatedData.slug = slugify(updatedData.name, { lower: true });

            console.log('update body:', updatedData);
            console.log('update files:', req.files);

            let uploadedImages = [];

            if (req.files && req.files.length > 0) {
                try {
                    for (const file of req.files) {
                        const result = await new Promise((resolve, reject) => {
                            const stream = cloudinary.uploader.upload_stream(
                                { folder: "products" },
                                (error, result) => (error ? reject(error) : resolve(result))
                            );
                            stream.end(file.buffer);
                        });
                        uploadedImages.push(result.secure_url);
                    }

                    const existingProduct = await Product.findById(productId);
                    if (!existingProduct) return res.status(404).json({ msg: "Product not found" });

                    updatedData.images = [...existingProduct.images, ...uploadedImages];
                } catch (uploadError) {
                    return res.status(500).json({ msg: "Error uploading images" });
                }
            }

            const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, {
                new: true,
            });

            if (!updatedProduct) return res.status(404).json({ msg: "Product not found" });
            res.status(200).json(updatedProduct);
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};


export const updateRating = async (req, res) => {
    try {
        const { productId, rating } = req.params;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        product.rating = parseFloat(rating);
        await product.save();

        return res.status(200).json({ msg: "Rating updated", rating: product.rating });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
};

export const updateReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { reviews } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        product.reviews = reviews;
        await product.save();

        return res.status(200).json({ msg: "Reviews updated", reviews: product.reviews });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error" });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) return res.status(404).json({ msg: "Product not found" });
        res.status(200).json({ msg: "Product deleted successfully" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const searchByCategory = async (req, res) => {
    try {
        console.log('params:', req.params);
        const products = await Product.find({ category: req.params.categoryid, subCategory: null, subSubCategory: null });
        console.log('received products:', products);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const searchBySubCategory = async (req, res) => {
    try {
        const subCategoryId = new mongoose.Types.ObjectId(req.params.subCategoryId);
        console.log('params search products subCat:', req.params);
        const products = await Product.find({ subCategory: subCategoryId, subSubCategory: null });
        console.log('searched products are:', products);
        res.json(products);
    } catch (err){
        console.log('error is', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const searchBySubSubCategory = async (req, res) => {
    try {
        console.log('params:', req.params);
        const products = await Product.find({ subSubCategory: req.params.subSubCategoryId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getFilteredProducts = async (req, res) => {
    const { diameter, steelGrade, price, thickness, weight } = req.query;
    let { hasMesh, revision, stock } = req.query;
    const filters = {};
    // if(hasMesh === undefined) hasMesh = false;
    // if(revision === undefined) revision = false;
    const stockValues = Array.isArray(stock) ? stock : [stock];

    const includeInStock = stockValues.includes("true");
    const includeOutOfStock = stockValues.includes("false");

    if (includeInStock && !includeOutOfStock) {
        filters.stock = { $gt: 0 };
    } else if (!includeInStock && includeOutOfStock) {
        filters.stock = { $lte: 0 };
    }
    if (diameter) {
        filters.diameter = Array.isArray(diameter) ? diameter.map(Number) : [Number(diameter)];
    }

    if (steelGrade) {
        filters.steelGrade = Array.isArray(steelGrade) ? steelGrade : [steelGrade];
    }

    if (price) {
        const priceArray = Array.isArray(price) ? price.map(Number) : [Number(price)];
        if (priceArray.length === 2) {
            filters.price = { $gte: priceArray[0], $lte: priceArray[1] };
        }
    }
    if (thickness){
        filters.thickness = Array.isArray(thickness) ? thickness : [thickness];
    }
    if (weight){
        filters.weight = Array.isArray(weight) ? weight : [weight];
    }
    if(hasMesh)
    filters.hasMesh = hasMesh;
    if(revision)
    filters.revision = revision;
    console.log('final filters in backend:', filters);
    const products = await Product.find(filters);
    console.log('received products:', products);
    res.json(products);
}



