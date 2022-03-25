import ProductModel from "../model.js";
import express from "express";
import createError from "http-errors";
import q2m from "query-to-mongo";

const productReviewsRouter = express.Router();

//6  POST a Review to a product
productReviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    console.log("➡️ PING - POST a REVIEW REQUEST");

    const newReview = {
      ...req.body,
      reviewDate: new Date(),
    };

    const product = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      { $push: { reviews: newReview } },
      { new: true, runValidators: true }
    );

    if (product) {
      res.send(product);
    } else {
      next(
        createError(404, `Product with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
  }
});

//7 GET Reviews for  a product
productReviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    console.log("➡️ PING - GET ALL COMMENTs REQUEST");

    const productReviews = await ProductModel.findById(req.params.productId);
    if (productReviews) {
      res.send(productReviews.reviews);
    } else {
      next(
        createError(404, `Product with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
//8 GET ONE Review for a product
productReviewsRouter.get(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      console.log("➡️ PING - GET a COMMENT REQUEST");

      const product = await ProductModel.findById(req.params.productId);
      if (product) {
        const review = product.reviews.find(
          (review) => review._id.toString() === req.params.reviewId
        );

        if (review) {
          res.send(review);
        } else {
          next(
            createError(404, `Review with id ${req.params.reviewId} not found!`)
          );
        }
      } else {
        next(
          createError(404, `Product with id ${req.params.productId} not found!`)
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
//9 EDIT Review for a product
productReviewsRouter.put(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      console.log("➡️ PING - EDIT a COMMENT REQUEST");

      const product = await ProductModel.findById(req.params.productId);
      if (product) {
        const index = product.reviews.findIndex(
          (review) => review._id.toString() === req.params.reviewId
        );
        if (index !== -1) {
          product.reviews[index] = {
            ...product.reviews[index].toObject(),
            ...req.body,
          };

          await product.save();

          res.send(product);
        } else {
          next(
            createError(404, `Review with id ${req.params.reviewId} not found!`)
          );
        }
      } else {
        next(
          createError(404, `Product with id ${req.params.productId} not found!`)
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
//10 DELETE Review from a product
productReviewsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      console.log("➡️ PING - DELETE a COMMENT REQUEST");

      const modifiedProduct = await ProductModel.findByIdAndUpdate(
        req.params.productId, //what
        { $pull: { reviews: { _id: req.params.reviewId } } }, //how
        { new: true } //options
      );
      if (modifiedProduct) {
        res.send(modifiedProduct);
      } else {
        next(
          createError(404, `Product with id ${req.params.productId} not found!`)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default productReviewsRouter;
