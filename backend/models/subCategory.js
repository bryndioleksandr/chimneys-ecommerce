import mongoose from "mongoose";
import slugify from "slugify";

const subCategorySchema = new mongoose.Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        basGroupId: {type: String, unique:true },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        subSubCategories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubSubCategory",
            }
        ],
        img: {
            type: String
        },
        cloudinaryPublicId: {
            type: String
        },
        slug: {
            type: String,
            unique: false,
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

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
