function loadData(callback) {
    console.log("Loading data...");

    setTimeout(() => {
        console.log("Data loaded!");

        callback();
    }, 2000);
}

function onDataLoaded() {
    console.log("Processing data...");
}

loadData(onDataLoaded);