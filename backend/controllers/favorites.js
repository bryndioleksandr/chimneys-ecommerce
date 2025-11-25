import Favorites from "../models/favorites.js";
import Product from "../models/product.js";

export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.params;

        const favorites = await Favorites.findOne({ userId }).populate("products");
        if (!favorites) {
            return res.status(200).json({ products: [] });
        }

        res.status(200).json(favorites.products);
    } catch (error) {
        res.status(500).json({ message: "Помилка при отриманні улюблених", error });
    }
};

export const addToFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId } = req.body;

        let favorites = await Favorites.findOne({ userId });

        if (!favorites) {
            favorites = new Favorites({ userId, products: [productId] });
        } else {
            if (!favorites.products.includes(productId)) {
                favorites.products.push(productId);
            }
        }

        await favorites.save();
        res.status(200).json({ message: "Товар додано до улюблених", favorites });
    } catch (error) {
        res.status(500).json({ message: "Помилка при додаванні", error });
    }
};

export const removeFromFavorites = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const favorites = await Favorites.findOne({ userId });

        if (!favorites) {
            return res.status(404).json({ message: "Список улюблених не знайдено" });
        }

        favorites.products = favorites.products.filter(
            (id) => id.toString() !== productId
        );

        await favorites.save();
        res.status(200).json({ message: "Товар видалено з улюблених", favorites });
    } catch (error) {
        res.status(500).json({ message: "Помилка при видаленні", error });
    }
};
