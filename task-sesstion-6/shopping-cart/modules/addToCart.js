const products = require("../data/products");
const cart = require("../data/cart");

function addToCart(productId) {

    const product = products.find(
        product => product.id === productId
    );

    if (!product) {
        console.log("Product not found");
        return;
    }

    cart.push(product);

    console.log(`${product.name} added to cart`);
}

module.exports = addToCart;