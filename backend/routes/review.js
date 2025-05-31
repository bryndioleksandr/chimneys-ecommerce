import express from "express";
import { createReview, getReviewsByProduct } from "../controllers/review.js";

const reviewRouter = express.Router();
const jsonParser = express.json();

reviewRouter.post("/create", createReview);
reviewRouter.get("/product-reviews/:productId", getReviewsByProduct);

export default reviewRouter;

