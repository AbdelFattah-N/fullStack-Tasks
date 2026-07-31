const addGrade = require("./modules/add.grade");
const deleteGrade = require("./modules/delete.grade");
const readGrades = require("./modules/read.grades");
const updateGrade = require("./modules/update.grade");


async function main() {

    // Add grades
    await addGrade("Ahmed", "Math", 85);

    await addGrade("Sara", "English", 92);

    await addGrade("Omar", "Computer Science", 78);


    // Read all grades
    console.log("\nAll Grades:");

    const grades = await readGrades();

    console.log(grades);


    // Update grade
    await updateGrade(1, 95);


    // Read after update
    console.log("\nAfter Update:");

    console.log(await readGrades());


    // Delete grade
    await deleteGrade(2);


    // Read after delete
    console.log("\nAfter Delete:");

    console.log(await readGrades());
}


main();