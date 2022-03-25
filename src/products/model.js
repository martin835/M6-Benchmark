import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  reviews: [
    {
      comment: { type: String, required: true },
      price: { type: Number, min: 1, max: 5, required: true },
    },
  ],
});

export default model("Product", productSchema);
