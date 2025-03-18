import mongoose from "mongoose";
import slugify from "slugify";

const subCategorySchema = new mongoose.Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products"
            }
        ],
        img: {
            type: String
        },
        slug: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

subCategorySchema.pre("save", function (next) {
    if (!this.slug) {
        this.slug = slugify(this.name, {lower: true, strict: true});
    }
    next();
});

const SubCategory = mongoose.model("Category", subCategorySchema);
export default SubCategory;
