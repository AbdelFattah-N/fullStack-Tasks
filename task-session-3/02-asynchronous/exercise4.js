function delayedMessage(message, delay) {
    setTimeout(() => {
        console.log(message);
    }, delay);
}

console.log("Starting...");

delayedMessage("Message received!", 2000);

console.log("Waiting...");