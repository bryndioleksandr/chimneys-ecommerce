import ConstructorOne from "../models/ConstructorOne.js";

export const createConstructor = async (req, res) => {
    try {
        const { name, description, product, area } = req.body;

        if (!product || !area) {
            return res.status(400).json({ message: "Product and area are required" });
        }

        const constructor = new ConstructorOne({
            name,
            description,
            products: [{ product, area }],
        });

        const saved = await constructor.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("Error creating constructor:", err);
        res.status(500).json({ message: "Failed to create constructor" });
    }
};

export const updateConstructor = async (req, res) => {
    try {
        const { name, description, product, area } = req.body;
        const { id } = req.params;

        const updated = await ConstructorOne.findByIdAndUpdate(
            id,
            {
                name,
                description,
                products: [{ product, area }],
            },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: "Constructor not found" });

        res.json(updated);
    } catch (err) {
        console.error("Error updating constructor:", err);
        res.status(500).json({ message: "Failed to update constructor" });
    }
};

// [PUT] /api/constructors/:id/element
export const updateConstructorElement = async (req, res) => {
    try {
        const { area, product } = req.body;

        if (!area || !product) {
            return res.status(400).json({ message: "Area and product are required" });
        }

        let constructor = await ConstructorOne.findOne();

        if (!constructor) {
            constructor = new ConstructorOne();
            await constructor.save();
        }

        const existingIndex = constructor.products.findIndex(p => p.area === area);

        if (existingIndex !== -1) {
            constructor.products[existingIndex].product = product;
        } else {
            constructor.products.push({ area, product });
        }

        await constructor.save();

        const populated = await ConstructorOne.findById(constructor._id).populate("products.product");

        res.json(populated);
    } catch (err) {
        console.error("Error updating constructor element:", err);
        res.status(500).json({ message: "Failed to update constructor element" });
    }
};


// [GET] /api/constructors/:id
export const getConstructor = async (req, res) => {
    try {
        const { id } = req.params;

        const constructor = await ConstructorOne.findById(id).populate("products.product");

        if (!constructor) return res.status(404).json({ message: "Constructor not found" });

        res.json(constructor);
    } catch (err) {
        console.error("Error fetching constructor:", err);
        res.status(500).json({ message: "Failed to fetch constructor" });
    }
};

// [GET] /api/constructors/:id/element/:area
export const getConstructorElement = async (req, res) => {
    try {
        const { area } = req.params;

        const constructor = await ConstructorOne.findOne().populate("products.product").populate("category subCategory subSubCategory");

        if (!constructor) {
            return res.status(404).json({ message: "Constructor not found" });
        }

        const element = constructor.products.find(p => p.area === Number(area));

        if (!element) {
            return res.status(404).json({ message: `Element with area ${area} not found` });
        }

        res.json(element);
    } catch (err) {
        console.error("Error fetching constructor element:", err);
        res.status(500).json({ message: "Failed to fetch constructor element" });
    }
};


// [DELETE] /api/constructors/:id
export const deleteConstructor = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ConstructorOne.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: "Constructor not found" });

        res.json({ message: "Constructor deleted" });
    } catch (err) {
        console.error("Error deleting constructor:", err);
        res.status(500).json({ message: "Failed to delete constructor" });
    }
};

// [DELETE] /api/constructors/:id/element/:area
export const deleteConstructorElement = async (req, res) => {
    try {
        const { area } = req.params;

        const updated = await ConstructorOne.findOneAndUpdate(
            {
                $pull: { products: { area: Number(area) } }
            },
            { new: true }
        ).populate("products.product");

        if (!updated) {
            return res.status(404).json({ message: "Constructor not found" });
        }

        res.json(updated);
    } catch (err) {
        console.error("Error deleting constructor element:", err);
        res.status(500).json({ message: "Failed to delete constructor element" });
    }
};
