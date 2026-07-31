function getPrice() {
    return 100;
}

function calculateDiscount(price) {
    return price * 0.9;
}

const price = getPrice();

const finalPrice = calculateDiscount(price);

console.log("Original Price:", price);
console.log("Final Price:", finalPrice);