import express from "express";
import {
    getAllPages,
    getPageBySlug,
    createPage,
    updatePage,
    deletePage
} from "../controllers/infoPage.js";
import {isAdmin, verifyToken} from "../middleware/auth.js";

const infoRouter = express.Router();


infoRouter.get("/", getAllPages);
infoRouter.get("/:slug", getPageBySlug);

infoRouter.post("/", createPage);
infoRouter.put("/:slug", verifyToken, isAdmin, updatePage);
infoRouter.delete("/:slug", verifyToken, isAdmin, deletePage);

export default infoRouter;
