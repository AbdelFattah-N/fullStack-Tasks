function login(username, password, callback) {
    console.log("Logging in...");

    setTimeout(() => {
        if (username === "admin" && password === "1234") {
            callback(true);
        } else {
            callback(false);
        }
    }, 2000);
}

function loginResult(success) {
    if (success) {
        console.log("Login successful!");
        nextStep();
    } else {
        console.log("Login failed!");
    }
}

function nextStep() {
    console.log("Welcome to your dashboard!");
}

login("admin", "1234", loginResult);