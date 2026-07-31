const cart = require("../data/cart");

function listCart() {

    if (cart.length === 0) {
        console.log("Cart is empty");
        return;
    }

    console.log("Cart items:");

    cart.forEach(product => {
        console.log(
            `${product.id} - ${product.name} - $${product.price}`
        );
    });
}

module.exports = listCart;