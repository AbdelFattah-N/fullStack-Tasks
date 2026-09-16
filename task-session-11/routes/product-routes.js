const express = require("express");
const productControllers = require("../controllers/product-controllers");

const router = express.Router();

router
  .route("/")
  .get(productControllers.getAllProducts)
  .post(productControllers.createProduct);

router
  .route("/:id")
  .get(productControllers.getProductById)
  .patch(productControllers.updateProduct)
  .delete(productControllers.deleteProduct);

module.exports = router;
