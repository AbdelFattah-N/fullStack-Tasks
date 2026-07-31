const addToCart = require("./modules/addToCart");
const removeFromCart = require("./modules/removeFromCart");
const listCart = require("./modules/listCart");
const calculateTotal = require("./modules/calculateTotal");


// Add products
addToCart(1);
addToCart(2);
addToCart(3);

console.log();


// List cart
listCart();

console.log();


// Calculate total
console.log("Total:", calculateTotal());

console.log();


// Remove product
removeFromCart(2);

console.log();


// List cart again
listCart();

console.log();


// Calculate total again
console.log("Total:", calculateTotal());