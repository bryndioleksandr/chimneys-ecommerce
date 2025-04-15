import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import slugify from "slugify";
import SubSubCategory from "../models/subSubCategory.js";
import SubCategory from "../models/subCategory.js";
import Category from "../models/category.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create subSubCategory
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

// Get all subSubCategories
export const getSubSubCategories = async (req, res) => {
    try {
        const allSubSubCategories = await SubSubCategory.find().populate("subCategory");
        res.status(200).json(allSubSubCategories);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

// Edit subSubCategory
export const editSubSubCategory = async (req, res) => {
    try {
        upload.single("subsubcategoryImage")(req, res, async (err) => {
            if (err) return res.status(400).json({ msg: "Error uploading file" });

            const { subSubCategoryId, name, subCategory, oldImagePath } = req.body;
            const updatedData = { name, subCategory };

            if (req.file) {
                try {
                    const result = await cloudinary.uploader.upload_stream(
                        { folder: "subsubcategories" },
                        (error, result) => {
                            if (error) return res.status(500).json({ msg: "Image upload failed" });
                            updatedData.img = result.secure_url;
                            cloudinary.uploader.destroy(oldImagePath);
                            SubSubCategory.findByIdAndUpdate(subSubCategoryId, updatedData)
                                .then(() => res.status(200).json({ msg: "Subsubcategory updated successfully" }))
                                .catch(err => res.status(500).json({ msg: err.message }));
                        }
                    );
                    result.end(req.file.buffer);
                } catch (error) {
                    return res.status(500).json({ msg: "Error updating image" });
                }
            } else {
                await SubSubCategory.findByIdAndUpdate(subSubCategoryId, updatedData);
                res.status(200).json({ msg: "Subsubcategory updated successfully" });
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

// Delete subSubCategory
export const removeSubSubCategory = async (req, res) => {
    try {
        const { subSubCategoryId, imagePath } = req.body;
        if (imagePath) await cloudinary.uploader.destroy(imagePath);
        await SubSubCategory.findByIdAndDelete(subSubCategoryId);
        res.status(200).json({ msg: "Subsubcategory successfully deleted" });
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
