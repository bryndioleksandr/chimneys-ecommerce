import mongoose from "mongoose";

const ConstructorSchemaTwo = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        area: {
            type: Number,
            required: true,
            validate: {
                validator: (v) => v >= 1 && v <= 30,
                message: props => `${props.value} is not a valid area ID`
            }
        }
    }],
    image: { type: String },
    price: { type: Number }
}, { timestamps: true });


const ConstructorTwo = mongoose.model("ConstructorTwo", ConstructorSchemaTwo);
export default ConstructorTwo;
