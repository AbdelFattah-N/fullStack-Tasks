const readGrades = require("./read.grades");
const saveGrades = require("./save.grades");

async function deleteGrade(id) {

    const grades = await readGrades();

    const index = grades.findIndex(
        grade => grade.id === id
    );

    if (index === -1) {
        console.log("Grade not found");
        return;
    }

    grades.splice(index, 1);

    await saveGrades(grades);

    console.log("Grade deleted successfully");
}

module.exports = deleteGrade;