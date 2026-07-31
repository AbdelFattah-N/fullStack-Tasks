const fs = require("fs").promises;

async function readGrades() {

    try {

        const data = await fs.readFile(
            "./data/grades.json",
            "utf8"
        );

        const grades = JSON.parse(data);

        return grades;

    } catch (error) {

        console.log("Error reading grades:", error.message);

        return [];
    }
}

module.exports = readGrades;