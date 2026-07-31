function calculateShipping(weight) {

    return new Promise((resolve, reject) => {

        if (weight <= 0) {
            reject("Invalid weight");
        } else {
            const cost = weight * 5;
            resolve(cost);
        }

    });
}

calculateShipping(10)
    .then((cost) => console.log("Shipping cost:", cost))
    .catch((error) => console.log(error));