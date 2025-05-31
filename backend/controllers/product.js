import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import Product from "../models/product.js";
import slugify from "slugify";

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
        const { productId } = req.params;
        const updatedData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

        if (!updatedProduct) return res.status(404).json({ msg: "Product not found" });
        res.status(200).json(updatedProduct);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
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
        console.log('params:', req.params);
        const products = await Product.find({ subCategory: req.params.subCategoryId, subSubCategory: null });
        res.json(products);
    } catch (err) {
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


