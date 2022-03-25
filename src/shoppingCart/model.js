import mongoose from "mongoose"

const { Schema, model } = mongoose

const shopCartSchema = new Schema(
  {
    ownerId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    products: [{ productId: { type: mongoose.Types.ObjectId, ref: "product" }, quantity: Number, _id: false }],
    status: { type: String, required: true, enum: ["active", "paid"] },
  },
  { timestamps: true }
)

export default model("shopCart", shopCartSchema)