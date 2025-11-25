import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import Category from "../models/category.js";
import Product from "../models/product.js";
import SubCategory from "../models/subCategory.js";
import SubSubCategory from "../models/subSubCategory.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createCategory = [
    upload.single("categoryImage"),
    async (req, res) => {
        try {
            const { name } = req.body;
            const categorySlug = slugify(name, { lower: true, strict: true });

            const catExists = await Category.exists({ slug: categorySlug });
            if (catExists) return res.status(400).json({ msg: "This category already exists" });

            let imagePath = "";
            let cloudinaryPublicId = "";

            if (req.file) {
                try {
                    const streamUpload = (buffer) => {
                        return new Promise((resolve, reject) => {
                            const stream = cloudinary.uploader.upload_stream(
                                { resource_type: "image", folder: "categories" },
                                (error, result) => {
                                    if (error) return reject(error);
                                    resolve(result);
                                }
                            );
                            stream.end(buffer);
                        });
                    };

                    const result = await streamUpload(req.file.buffer);
                    imagePath = result.secure_url;
                    cloudinaryPublicId = result.public_id;

                } catch (error) {
                    console.error("Error uploading image to Cloudinary:", error);
                    return res.status(500).json({ msg: "Error uploading image" });
                }
            }

            const newCategory = new Category({
                name: name,
                slug: categorySlug,
                img: imagePath,
                cloudinaryPublicId,
            });

            await newCategory.save();
            const allCategories = await Category.find();
            res.status(200).json(allCategories);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
];

export const updateCategory = [
    upload.single("categoryImage"),
    async (req, res) => {
        const { id } = req.params;

        try {
            const category = await Category.findById(id);
            if (!category) return res.status(404).json({ msg: "Category not found" });

            const { name } = req.body;

            let updatedFields = {};

            if (name) {
                updatedFields.name = name;
                updatedFields.slug = slugify(name, { lower: true, strict: true });

                const exists = await Category.findOne({ slug: updatedFields.slug, _id: { $ne: id } });
                if (exists) return res.status(400).json({ msg: "Another category with the same name already exists" });
            }

            if (req.file) {
                if (category.cloudinaryPublicId) {
                    await cloudinary.uploader.destroy(category.cloudinaryPublicId);
                }

                const streamUpload = (buffer) => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: "image", folder: "categories" },
                            (error, result) => {
                                if (error) return reject(error);
                                resolve(result);
                            }
                        );
                        stream.end(buffer);
                    });
                };

                const result = await streamUpload(req.file.buffer);
                updatedFields.img = result.secure_url;
                updatedFields.cloudinaryPublicId = result.public_id;
            }

            const updatedCategory = await Category.findByIdAndUpdate(id, updatedFields, { new: true });

            res.status(200).json(updatedCategory);
        } catch (error) {
            console.error("Помилка при оновленні категорії:", error);
            return res.status(500).json({ msg: "Не вдалося оновити категорію" });
        }
    },
];


export const getCategories = async (req, res) => {
    try {
        const allCategories = await Category.find();
        res.status(200).json(allCategories);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const removeCategory = async (req, res) => {
    const category_id = req.params.id;
    try {
        const category = await Category.findById(category_id);
        if (category.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(category.cloudinaryPublicId);
        }

        await Product.deleteMany({ category: category_id });
        await SubCategory.deleteMany({ category: category_id });
        await SubSubCategory.deleteMany({ category: category_id });
        await Category.findByIdAndDelete(category_id);
        res.status(200).json({ msg: "Category and its products successfully deleted" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const searchByName = async (req, res) => {
    try {
        const category = await Category.find({ slug: req.params.name});
        res.json(category);
    }
    catch(error) {
        return res.status(500).json({ msg: error.message });
    }
}

export const searchBySlug = async (req, res) => {
    try {
        const category = await Category.find({ slug: req.params.slug});
        res.json(category);
    }
    catch(error) {
        return res.status(500).json({ msg: error.message });
    }
}

export const editCategory = [
    upload.single("categoryImage"),
    async (req, res) => {
        const { categoryId, categoryName, oldCloudinaryPublicId, oldImagePath } = req.body;
        try {
            const categorySlug = slugify(categoryName, { lower: true, strict: true });

            let updatedData = { name: categoryName, slug: categorySlug };

            if (req.file) {
                const result = await cloudinary.uploader.upload_stream(
                    { resource_type: "image", folder: "categories" },
                    (error, result) => {
                        if (error) throw error;
                        updatedData.image = result.secure_url;
                        updatedData.cloudinaryPublicId = result.public_id;
                        return result;
                    }
                ).end(req.file.buffer);

                if (oldCloudinaryPublicId) await cloudinary.uploader.destroy(oldCloudinaryPublicId);
            } else {
                updatedData.image = oldImagePath;
                updatedData.cloudinaryPublicId = oldCloudinaryPublicId;
            }

            await Category.findByIdAndUpdate(categoryId, updatedData);
            res.status(200).json({ message: "Category successfully updated" });
        } catch (error) {
            console.error("Error updating category:", error);
            return res.status(500).json({ msg: error.message });
        }
    },
];
