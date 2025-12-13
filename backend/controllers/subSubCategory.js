import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import slugify from "slugify";
import SubSubCategory from "../models/subSubCategory.js";
import SubCategory from "../models/subCategory.js";
import Category from "../models/category.js";
import Product from "../models/product.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createSubSubCategory = async (req, res) => {
    try {
        upload.single("subsubcategoryImage")(req, res, async (err) => {
            if (err) return res.status(400).json({ msg: "Error uploading file" });

            const { subCategory, name } = req.body;
            const subSubCategorySlug = slugify(name, { lower: true, strict: true });
            const subSubCatExists = await SubSubCategory.exists({ slug: subSubCategorySlug });
            if (subSubCatExists) return res.status(400).json({ msg: "This subsubcategory already exists" });

            const newSubSubCategory = new SubSubCategory({
                subCategory,
                name,
                slug: subSubCategorySlug,
            });

            if (req.file) {
                try {
                    const result = await cloudinary.uploader.upload_stream(
                        { folder: "subsubcategories" },
                        (error, result) => {
                            if (error) return res.status(500).json({ msg: "Image upload failed" });
                            newSubSubCategory.img = result.secure_url;
                            newSubSubCategory.save()
                                .then(() => res.status(200).json(newSubSubCategory))
                                .catch(err => res.status(500).json({ msg: err.message }));
                        }
                    );
                    result.end(req.file.buffer);
                } catch (error) {
                    return res.status(500).json({ msg: "Error uploading image" });
                }
            } else {
                await newSubSubCategory.save();
                res.status(200).json(newSubSubCategory);
            }
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const getSubSubCategories = async (req, res) => {
    try {
        const allSubSubCategories = await SubSubCategory.find().populate("subCategory");
        res.status(200).json(allSubSubCategories);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const updateSubSubCategory = [
    upload.single("subsubcategoryImage"),
    async (req, res) => {
        const { id } = req.params;

        try {
            const subSubCategory = await SubSubCategory.findById(id);
            if (!subSubCategory) return res.status(404).json({ msg: "SubSubCategory not found" });

            const { name } = req.body;

            let updatedFields = {};

            if (name) {
                updatedFields.name = name;
                updatedFields.slug = slugify(name, { lower: true, strict: true });

                const exists = await SubSubCategory.findOne({ slug: updatedFields.slug, _id: { $ne: id } });
                if (exists) return res.status(400).json({ msg: "Another subsubcategory with the same name already exists" });
            }

            if (req.file) {
                if (subSubCategory.cloudinaryPublicId) {
                    await cloudinary.uploader.destroy(subSubCategory.cloudinaryPublicId);
                }

                const streamUpload = (buffer) => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: "image", folder: "subsubcategories" },
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

            const updatedSubSubCategory = await SubSubCategory.findByIdAndUpdate(id, updatedFields, { new: true });

            res.status(200).json(updatedSubSubCategory);
        } catch (error) {
            console.error("Помилка при оновленні підпідкатегорії:", error);
            return res.status(500).json({ msg: "Не вдалося оновити підпідкатегорію" });
        }
    },
];

export const removeSubSubCategory = async (req, res) => {
    try {
        const { subSubCategoryId, imagePath } = req.body;
        if (imagePath) await cloudinary.uploader.destroy(imagePath);
        await Product.deleteMany({ subSubCategory: subSubCategoryId });
        await SubSubCategory.findByIdAndDelete(subSubCategoryId);
        res.status(200).json({ msg: "SubSubCategory successfully deleted" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export const findSubSubCategoryByName  = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ msg: "Name is required" });

        const subCategory = await SubCategory.findOne({ name: { $regex: new RegExp(name, "i") } });
        if (!subCategory) return res.status(404).json({ msg: "SubCategory not found" });

        const subCategories = await SubSubCategory.find({ subCategory: subCategory._id }).populate("subCategory");

        res.status(200).json(subCategories);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const findSubSubCategoryBySlug  = async (req, res) => {
    try {
        const { slug } = req.query;
        if (!slug) return res.status(400).json({ msg: "slug is required" });
        console.log('slug find subsubcat: ', slug);

        const subCategory = await SubCategory.findOne({ slug: slug });
        if (!subCategory) return res.status(404).json({ msg: "subCategory not found" });

        console.log('_id isisis', subCategory._id);
        const subSubCategories = await SubSubCategory.find({ subCategory: subCategory._id });
        console.log('result find is:', subSubCategories);
        res.status(200).json(subSubCategories);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const searchBySlug = async (req, res) => {
    try {
        console.log('params for one subsub:', req.query);
        const subSubCategory = await SubSubCategory.find({ slug: req.query.slug}).populate({
            path: "subCategory",
            populate: {
                path: "category",
                select: "name slug"
            }
        });
        console.log('onesubsubcat back:', subSubCategory);
        res.json(subSubCategory);
    }
    catch(error) {
        return res.status(500).json({ msg: error.message });
    }
}
