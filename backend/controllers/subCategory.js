import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import slugify from "slugify";
import SubCategory from "../models/subCategory.js";
import Category from "../models/category.js";
import Product from "../models/product.js";
import SubSubCategory from "../models/subSubCategory.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createSubCategory = async (req, res) => {
    try {
        upload.single("subcategoryImage")(req, res, async (err) => {
            if (err) return res.status(400).json({ msg: "Error uploading file" });

            const { category, name } = req.body;
            const subCategorySlug = slugify(name, { lower: true, strict: true });
            const subCatExists = await SubCategory.exists({ slug: subCategorySlug });
            if (subCatExists) return res.status(400).json({ msg: "This subcategory already exists" });

            const newSubCategory = new SubCategory({
                category,
                name,
                slug: subCategorySlug,
            });

            if (req.file) {
                try {
                    const result = await cloudinary.uploader.upload_stream(
                        { folder: "subcategories" },
                        (error, result) => {
                            if (error) return res.status(500).json({ msg: "Image upload failed" });
                            newSubCategory.img = result.secure_url;
                            newSubCategory.save()
                                .then(() => res.status(200).json(newSubCategory))
                                .catch(err => res.status(500).json({ msg: err.message }));
                        }
                    );
                    result.end(req.file.buffer);
                } catch (error) {
                    return res.status(500).json({ msg: "Error uploading image" });
                }
            } else {
                await newSubCategory.save();
                res.status(200).json(newSubCategory);
            }
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const getSubCategories = async (req, res) => {
    try {
        const allSubCategories = await SubCategory.find().populate("category");
        res.status(200).json(allSubCategories);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};


export const updateSubCategory = [
    upload.single("subcategoryImage"),
    async (req, res) => {
        const { id } = req.params;

        try {
            const subCategory = await SubCategory.findById(id);
            if (!subCategory) return res.status(404).json({ msg: "SubCategory not found" });

            const { name } = req.body;

            let updatedFields = {};

            if (name) {
                updatedFields.name = name;
                updatedFields.slug = slugify(name, { lower: true, strict: true });

                const exists = await SubCategory.findOne({ slug: updatedFields.slug, _id: { $ne: id } });
                if (exists) return res.status(400).json({ msg: "Another category with the same name already exists" });
            }

            if (req.file) {
                if (subCategory.cloudinaryPublicId) {
                    await cloudinary.uploader.destroy(subCategory.cloudinaryPublicId);
                }

                const streamUpload = (buffer) => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: "image", folder: "subcategories" },
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

            const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, updatedFields, { new: true });

            res.status(200).json(updatedSubCategory);
        } catch (error) {
            console.error("Помилка при оновленні підкатегорії:", error);
            return res.status(500).json({ msg: "Не вдалося оновити підкатегорію" });
        }
    },
];


export const removeSubCategory = async (req, res) => {
    try {
        const { subCategoryId, imagePath } = req.body;
        if (imagePath) await cloudinary.uploader.destroy(imagePath);
        await Product.deleteMany({ subCategory: subCategoryId });
        await SubSubCategory.deleteMany({  subCategory: subCategoryId });
        await SubCategory.findByIdAndDelete(subCategoryId);
        res.status(200).json({ msg: "Subcategory successfully deleted" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const findSubCategoryByName  = async (req, res) => {
    try {
        console.log('we are in find subcategories, name is ', name);
        const { name } = req.query;
        if (!name) return res.status(400).json({ msg: "Name is required" });

        const category = await Category.findOne({ name: { $regex: new RegExp(name, "i") } });
        if (!category) return res.status(404).json({ msg: "Category not found" });

        const subCategories = await SubCategory.find({ category: category._id }).populate("category");
        res.status(200).json(subCategories);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

//finds subcategories by category name in general
export const findSubCategoryBySlug  = async (req, res) => {
    try {
        const { slug } = req.query;
        if (!slug) return res.status(400).json({ msg: "slug is required" });
        console.log('slug find subcat: ', slug);

        const category = await Category.findOne({ slug: slug });
        if (!category) return res.status(404).json({ msg: "Category not found" });

        console.log('_id isisis', category._id);
        const subCategories = await SubCategory.find({ category: category._id }).populate("category");
        res.status(200).json(subCategories);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

//finds one subcategory
export const searchBySlug = async (req, res) => {
    try {
        const subCategory = await SubCategory.find({ slug: req.params.slug});
        res.json(subCategory);
    }
    catch(error) {
        return res.status(500).json({ msg: error.message });
    }
}
