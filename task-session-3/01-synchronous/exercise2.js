function firstFunction() {
    console.log("First function");
    secondFunction();
}

function secondFunction() {
    console.log("Second function");
}

console.log("Start");

firstFunction();

console.log("End");