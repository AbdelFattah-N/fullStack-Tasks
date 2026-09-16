const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/db-connect");
const productRouter = require("./routes/product-routes");

dotenv.config();

dbConnect();

const app = express();

app.use(express.json());

// Product Routes
app.use("/api/v1/products", productRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Task 11 Product Management API");
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
