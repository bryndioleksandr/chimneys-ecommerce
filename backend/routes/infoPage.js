import express from "express";
import {
    getAllPages,
    getPageBySlug,
    createPage,
    updatePage,
    deletePage
} from "../controllers/infoPage.js";

const infoRouter = express.Router();


infoRouter.get("/", getAllPages);
infoRouter.get("/:slug", getPageBySlug);

infoRouter.post("/", createPage);
infoRouter.put("/:slug", updatePage);
infoRouter.delete("/:slug", deletePage);

export default infoRouter;
