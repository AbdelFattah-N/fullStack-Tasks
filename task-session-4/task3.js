function sendVerificationEmail(email) {
    return new Promise((resolve, reject) => {

        console.log("Sending verification email...");

        setTimeout(() => {

            if (email) {
                console.log("Email sent successfully");
                resolve();
            } else {
                reject("Invalid email");
            }

        }, 2000);
    });
}


async function registerUser(name, email) {
    try {

        if (!name || !email) {
            console.log("Invalid user data");
            return;
        }

        await sendVerificationEmail(email);

        console.log("User registered successfully");

    } catch (error) {
        console.log(error);
    }
}


registerUser("Esraa", "esraa@gmail.com");