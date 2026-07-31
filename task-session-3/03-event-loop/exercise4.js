console.log("Start");

setTimeout(() => {
    console.log("Async task");
}, 0);

for (let i = 1; i <= 3; i++) {
    console.log("Sync:", i);
}

console.log("End");