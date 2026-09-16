const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const dbConnect = require("./config/db-connect");
const productRouter = require("./routes/product-routes");

dotenv.config();

dbConnect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Product API Routes
app.use("/api/v1/products", productRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Task 12 Product & File Upload API (Multer)");
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
