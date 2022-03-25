import express from "express"
import createError from "http-errors"
import shopCartModel from "./model.js"

const shopCartRouter = express.Router()

shopCartRouter.post("/:userId", async (req, res, next) => {
    try {

      const { productId, quantity } = req.body
  
      const user = await usersModel.findById(req.params.userId)
      if (!user) return next(createError(404, `User with id ${req.params.userId} not found`))
  
      const purchasedProduct = await productsModel.findById(productId)
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
        )
        res.send(modifiedCart)
      } else {
  
        const modifiedCart = await shopCartModel.findOneAndUpdate(
          { status: "active", ownerId: req.params.userId },
          { $push: { products: { quantity, productId: purchasedProduct._id } } }, 
          {
            new: true, 
            upsert: true,
          }
        )
        res.send(modifiedCart)
      }
    } catch (error) {
      next(error)
    }
  })




  export default shopCartRouter