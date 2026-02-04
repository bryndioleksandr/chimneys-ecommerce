import express from "express";
import {
    getAllPages,
    getPageBySlug,
    createPage,
    updatePage,
    deletePage
} from "../controllers/infoPage.js";
import {isAdmin, verifyToken} from "../middleware/auth.js";
import {pageSchema} from "../utils/validation.js";
import {validate} from "../middleware/validate.js";

const infoRouter = express.Router();


infoRouter.get("/", getAllPages);
infoRouter.get("/:slug", getPageBySlug);

infoRouter.post("/", validate(pageSchema), createPage);
infoRouter.put("/:slug", verifyToken, isAdmin, updatePage);
infoRouter.delete("/:slug", verifyToken, isAdmin, deletePage);

export default infoRouter;
