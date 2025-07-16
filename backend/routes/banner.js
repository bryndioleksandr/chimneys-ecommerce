import express from "express";
import {createBanner, deleteBanner, getAllBanners} from "../controllers/banner.js"

const bannerRouter = express.Router();
const jsonParser = express.json();

bannerRouter.get("/banners", getAllBanners);
bannerRouter.post("/banners", createBanner);
bannerRouter.delete("/banners/:id", deleteBanner);

export default bannerRouter;

