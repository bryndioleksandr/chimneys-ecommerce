import Review from "../models/review.js";
import Product from "../models/product.js";

export const createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;
        const userId = req.user.id;

        const newReview = new Review({
            user: userId,
            product,
            rating,
            comment
        });

        await newReview.save();

        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId }).populate("user", "name");
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ msg: "Відгук не знайдено" });
        }

        if (review.user.toString() !== userId) {
            return res.status(403).json({ msg: "Ви не можете редагувати цей відгук" });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ msg: "Відгук не знайдено" });
        }

        if (review.user.toString() !== userId) {
            return res.status(403).json({ msg: "Ви не можете видалити цей відгук" });
        }

        await review.deleteOne();

        res.status(200).json({ msg: "Відгук успішно видалено" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
