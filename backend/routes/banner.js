import express from "express";
import {createBanner, deleteBanner, getAllBanners} from "../controllers/banner.js"
import {isAdmin, verifyToken} from "../middleware/auth.js";

const bannerRouter = express.Router();
const jsonParser = express.json();

bannerRouter.get("/banners", getAllBanners);
bannerRouter.post("/banners", verifyToken, isAdmin, createBanner);
bannerRouter.delete("/banners/:id", verifyToken, isAdmin, deleteBanner);

export default bannerRouter;

