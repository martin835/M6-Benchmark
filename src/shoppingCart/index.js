import express from "express"
import createError from "http-errors"
import shopCartModel from "./model.js"
import UsersModel from "../users/model.js"
import ProductModel from "../products/model.js";

const shopCartRouter = express.Router()

shopCartRouter.post("/:userId", async (req, res, next) => {
    try {

      const { productId, quantity } = req.body
  
      const user = await UsersModel.findById(req.params.userId)
      if (!user) return next(createError(404, `User with id ${req.params.userId} not found`))
  
      const purchasedProduct = await ProductModel.findById(productId)
      if (!purchasedProduct) return next(createError(404, `Product with id ${productId} not found`))

      const isProduct = await shopCartModel.findOne({ status: "active", ownerId: req.params.userId, "products.productId": purchasedProduct._id })
  
      if (isProduct) {
  
        const modifiedCart = await shopCartModel.findOneAndUpdate(
          {
            ownerId: req.params.userId,
            status: "active",
            "products.productId": purchasedProduct._id,
          },
          {
            $inc: { "products.$.quantity": quantity }, 
          },
          {
            new: true,
          }
        ).populate({ path: "ownerId", select: "firstName lastName" })
        .populate({path: "products", populate: { path: "productId", select: "name price"} })
        res.send(modifiedCart)
      } else {
  
        const modifiedCart = await shopCartModel.findOneAndUpdate(
          { status: "active", ownerId: req.params.userId },
          { $push: { products: { quantity, productId: purchasedProduct._id } } }, 
          {
            new: true, 
            upsert: true,
          }
        ).populate({ path: "ownerId", select: "firstName lastName" })
        .populate({path: "products", populate: { path: "productId", select: "name price"} })
        res.send(modifiedCart)
      }
    } catch (error) {
      next(error)
    }
  })

  shopCartRouter.get("/", async (req, res, next) => {
    try {
      const carts = await shopCartModel.find().populate({ path: "ownerId", select: "firstName lastName" })
      .populate({path: "products", populate: { path: "productId", select: "name price"} })
      res.send(carts)
    } catch (error) {
      next(error)
    }
  })

 shopCartRouter.put("/:cartId", async (req, res, next) => {
    try {
      const updatedCart = await shopCartModel.findByIdAndUpdate(
        req.params.cartId, 
        req.body, 
        { new: true, runValidators: true } 
      ).populate({ path: "ownerId", select: "firstName lastName" })
      .populate({path: "products", populate: { path: "productId", select: "name price"} })

  
      if (updatedCart) {
        res.send(updatedCart)
      } else {
        next(createError(404, `Cart with id ${req.params.cartId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })


shopCartRouter.delete("/:cartId/delete/:productId", async (req, res, next) => {
    try {
      const modifiedShopCart = await shopCartModel.findByIdAndUpdate(
        req.params.cartId, // WHO
        { $pull: { products: { productId: req.params.productId } } }, // HOW
        { new: true }
      ).populate({ path: "ownerId", select: "firstName lastName" })
      .populate({path: "products", populate: { path: "productId", select: "name price"} })
  
      if (modifiedShopCart) {
        res.send(modifiedShopCart)
      } else {
        next(createError(404, `User with id ${req.params.cartId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })



  export default shopCartRouter