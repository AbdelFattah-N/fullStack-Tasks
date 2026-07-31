const readGrades = require("./read.grades");
const saveGrades = require("./save.grades");

async function updateGrade(id, newGrade) {

    const grades = await readGrades();

    const gradeRecord = grades.find(
        grade => grade.id === id
    );

    if (!gradeRecord) {
        console.log("Grade not found");
        return;
    }

    gradeRecord.grade = newGrade;

    await saveGrades(grades);

    console.log("Grade updated successfully");
}

module.exports = updateGrade;