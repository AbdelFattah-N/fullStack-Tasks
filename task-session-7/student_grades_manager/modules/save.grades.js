const fs = require("fs").promises;

async function saveGrades(grades) {
    try {

        await fs.writeFile(
            "./data/grades.json",
            JSON.stringify(grades, null, 2)
        );

        console.log("Grades saved successfully");

    } catch (error) {
        console.log("Error saving grades:", error.message);
    }
}

module.exports = saveGrades;