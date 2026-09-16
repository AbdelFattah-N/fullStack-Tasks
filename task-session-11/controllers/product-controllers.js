const Product = require("../models/product-model");

// GET /api/v1/products - Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      count: products.length,
      data: {
        products
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to fetch products: ${error.message}`
    });
  }
};

// GET /api/v1/products/:id - Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found"
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        product
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: `Invalid ID format: ${error.message}`
    });
  }
};

// POST /api/v1/products - Create a new product
const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        product: newProduct
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

// PATCH /api/v1/products/:id - Update product by ID
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found"
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

// DELETE /api/v1/products/:id - Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found"
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
