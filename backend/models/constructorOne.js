import mongoose from "mongoose";

const ConstructorSchemaOne = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        area: {
            type: Number,
            validate: {
                validator: (v) => v >= 1 && v <= 26,
                message: props => `${props.value} is not a valid area ID`
            }
        }
    }],

}, { timestamps: true });


const ConstructorOne = mongoose.models.ConstructorOne || mongoose.model("ConstructorOne", ConstructorSchemaOne);
export default ConstructorOne;
