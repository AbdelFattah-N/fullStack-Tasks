const express = require("express");
const productControllers = require("../controllers/product-controllers");
const upload = require("../middlewares/upload-middleware");

const router = express.Router();

router
  .route("/")
  .get(productControllers.getAllProducts)
  .post(upload.single("image"), productControllers.createProduct);

router
  .route("/:id")
  .get(productControllers.getProductById)
  .patch(upload.single("image"), productControllers.updateProduct)
  .delete(productControllers.deleteProduct);

module.exports = router;
