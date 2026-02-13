import Product from '../models/product.js';
import mongoose from "mongoose";

export const getFiltersByCategory = async (req, res) => {
    let { categoryId, subCategoryId, subSubCategoryId } = req.params;
    console.log('received:', req.params);
    if (!categoryId || categoryId === 'undefined' || !mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.json({ filters: {} });
    }

    if (subCategoryId === 'undefined' || !mongoose.Types.ObjectId.isValid(subCategoryId)) {
        subCategoryId = null;
    }

    if (subSubCategoryId === 'undefined' || !mongoose.Types.ObjectId.isValid(subSubCategoryId)) {
        subSubCategoryId = null;
    }
    // if (!subCategoryId) subCategoryId = null;
    // if (!subSubCategoryId) subSubCategoryId = null;
    try {
        const products = await Product.find({ category: categoryId, subCategory: subCategoryId ?? null, subSubCategory: subSubCategoryId ?? null });

        if (!products.length) {
            return res.json({ filters: {} });
        }

        const filtersMap = {};

        for (const product of products) {
            const fixedFields = {
                steelGrade: product.steelGrade,
                thickness: product.thickness,
                diameter: product.diameter,
                angle: product.angle,
                revision: product.revision,
                hasMesh: product.hasMesh,
                insulationThickness: product.insulationThickness,
                length: product.length,
                weight: product.weight,
                price: product.price,
                stock: product.stock,
            };

            for (const [key, value] of Object.entries(fixedFields)) {
                if (value !== undefined && value !== null) {
                    if (!filtersMap[key]) {
                        filtersMap[key] = new Set();
                    }
                    filtersMap[key].add(value);
                }
            }

            if (product.customAttributes) {
                for (const [key, value] of product.customAttributes.entries()) {
                    if (!filtersMap[key]) {
                        filtersMap[key] = new Set();
                    }
                    filtersMap[key].add(value);
                }
            }
        }

        const filters = {};
        for (const [key, valueSet] of Object.entries(filtersMap)) {
            filters[key] = Array.from(valueSet);
        }

        res.json({ filters });

    } catch (err) {
        console.error('Помилка при отриманні фільтрів:', err);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
};
