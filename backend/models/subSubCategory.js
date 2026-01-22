import mongoose from "mongoose";
import slugify from "slugify";

const subSubCategorySchema = new mongoose.Schema(
    {
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            required: true,
        },
        basGroupId: {type: String, unique:true },
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

subSubCategorySchema.pre("save", function (next) {
    if (!this.slug) {
        this.slug = slugify(this.name, {lower: true, strict: true});
    }
    next();
});

const SubSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);
export default SubSubCategory;
