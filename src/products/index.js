import express from "express";
import createError from "http-errors";
import q2m from "query-to-mongo";
import ProductModel from "./model.js";

const productsRouter = express.Router();

//1 POST a Product
productsRouter.post("/", async (req, res, next) => {
  try {
    console.log("📨 PING - POST REQUEST");

    const newProduct = new ProductModel(req.body);

    await newProduct.save();

    res.send(newProduct._id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//2 Get all Products

productsRouter.get("/", async (req, res, next) => {
  try {
    console.log("➡️ PING - GET ALL REQUEST");
    console.log("REQ QUERY: ", req.query);
    console.log("QUERY-TO-MONGO: ", q2m(req.query));
    const mongoQuery = q2m(req.query);

    const data = await ProductModel.find();

    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//3 Get One Product

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    console.log("➡️ PING - GET ONE REQUEST");

    const product = await ProductModel.findById(req.params.productId);

    if (product) {
      res.send(product);
    } else {
      next(
        createError(404, `Product with id ${req.params.productId} not found :(`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//4 Edit one Product
productsRouter.put("/:productId", async (req, res, next) => {
  console.log("➡️ PING - EDIT A PRODUCT REQUEST");

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      next(
        createError(404, `Product with id ${req.params.productId} not found!`)
      );
    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});
//5 Delete one Product

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    console.log("➡️ PING - DELETE Product REQUEST");
    const deleteProduct = await ProductModel.findByIdAndDelete(
      req.params.productId
    );
    if (deleteProduct) {
      res.status(204).send();
    } else {
      next(
        createError(404, `Product with id ${req.params.productId} not found :(`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default productsRouter;
