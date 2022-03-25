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
      rate: { type: Number, min: 1, max: 5, required: true },
    },
  ],
});

productSchema.static("filterData", async function (mongoQuery) {
  const data = await this.find(mongoQuery.criteria);

  return data;
});

export default model("Product", productSchema);
