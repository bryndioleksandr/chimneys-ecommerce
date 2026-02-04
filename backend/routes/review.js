import express from "express";
import { createReview, getReviewsByProduct } from "../controllers/review.js";
import {reviewSchema} from "../utils/validation.js";
import {validate} from "../middleware/validate.js";

const reviewRouter = express.Router();
const jsonParser = express.json();

reviewRouter.post("/create", validate(reviewSchema), createReview);
reviewRouter.get("/product-reviews/:productId", getReviewsByProduct);

export default reviewRouter;

