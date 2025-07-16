import { Banner } from "../models/Banner.js";
import cloudinary from "cloudinary";
import multer from "multer";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (err) {
        res.status(500).json({ msg: "Помилка при отриманні банерів" });
    }
};

export const createBanner = async (req, res) => {
    upload.single("image")(req, res, async (err) => {
        if (err) return res.status(400).json({ msg: "Помилка при завантаженні зображення" });

        const { alt } = req.body;

        if (!req.file) return res.status(400).json({ msg: "Файл не передано" });

        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    { folder: "banners" },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                stream.end(req.file.buffer);
            });

            const newBanner = new Banner({
                image: result.secure_url,
                alt: alt || "",
            });

            await newBanner.save();
            res.status(200).json(newBanner);
        } catch (err) {
            console.error("Cloudinary error:", err);
            res.status(500).json({ msg: "Помилка завантаження банера" });
        }
    });
};

export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ msg: "Банер не знайдено" });

        await Banner.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Банер видалено" });
    } catch (err) {
        res.status(500).json({ msg: "Помилка при видаленні банера" });
    }
};
