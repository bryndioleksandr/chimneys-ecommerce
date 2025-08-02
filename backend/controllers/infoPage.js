import StaticPage from "../models/infoPage.js";

export const getAllPages = async (req, res) => {
    try {
        const pages = await StaticPage.find().sort({ updatedAt: -1 });
        res.json(pages);
    } catch (err) {
        res.status(500).json({ message: "Помилка при отриманні сторінок" });
    }
};

export const getPageBySlug = async (req, res) => {
    try {
        const page = await StaticPage.findOne({ slug: req.params.slug });
        if (!page) return res.status(404).json({ message: "Сторінка не знайдена" });
        res.json(page);
    } catch (err) {
        res.status(500).json({ message: "Помилка при отриманні сторінки" });
    }
};

export const createPage = async (req, res) => {
    try {
        const { slug, title, content } = req.body;

        const existing = await StaticPage.findOne({ slug });
        if (existing) {
            return res.status(400).json({ message: "Сторінка з таким slug вже існує" });
        }

        const page = new StaticPage({ slug, title, content });
        await page.save();
        res.status(201).json(page);
    } catch (err) {
        res.status(500).json({ message: "Помилка при створенні сторінки" });
    }
};

export const updatePage = async (req, res) => {
    try {
        const { title, content } = req.body;

        const page = await StaticPage.findOneAndUpdate(
            { slug: req.params.slug },
            { title, content, updatedAt: new Date() },
            { new: true }
        );

        if (!page) {
            return res.status(404).json({ message: "Сторінка не знайдена" });
        }

        res.json(page);
    } catch (err) {
        res.status(500).json({ message: "Помилка при оновленні сторінки" });
    }
};

export const deletePage = async (req, res) => {
    try {
        const page = await StaticPage.findOneAndDelete({ slug: req.params.slug });
        if (!page) return res.status(404).json({ message: "Сторінка не знайдена" });
        res.json({ message: "Сторінка успішно видалена" });
    } catch (err) {
        res.status(500).json({ message: "Помилка при видаленні сторінки" });
    }
};
