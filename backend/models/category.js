import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        subCategories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubCategory"
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
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.pre("save", function (next) {
    if (!this.slug) {
        this.slug = slugify(this.name, {lower: true, strict: true});
    }
    next();
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
