const cart = require("../data/cart");

function removeFromCart(productId) {

    const index = cart.findIndex(
        product => product.id === productId
    );

    if (index === -1) {
        console.log("Product not found in cart");
        return;
    }

    const removedProduct = cart.splice(index, 1);

    console.log(
        `${removedProduct[0].name} removed from cart`
    );
}

module.exports = removeFromCart;