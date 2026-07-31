

// Step 1: Person Class

class Person {

    #email;
    #id;

    constructor(name, email, id) {
        this.name = name;
        this.email = email;
        this.id = id;
    }
    // Getter for email
    get email() {
        return this.#email;
    }
    //Setter for email
    set email(value) {

        if (value.includes("@")) {
            this.#email = value;
        } else {
            console.log("Invalid email");
        }
    }
    // Getter for Id
    get id() {
        return this.#id;
    }
    // Setter for Id
    set id(value) {

        if (value > 0) {
            this.#id = value;
        } else {
            console.log("Invalid ID");
        }
    }

    describeRole() {
    console.log("This person is a member of the school.");
    }
}
// Step 2: Principal Class

class Principal extends Person {

    constructor(name, email, id) {
        super(name, email, id);

        this.members = [];
    }

    // Add a Teacher or Student
    addMember(member) {
        this.members.push(member);

        console.log(`${member.name} was added to the school.`);
    }

    // Remove a member
    removeMember(id) {

        this.members = this.members.filter(member => member.id !== id);

        console.log(`Member with ID ${id} was removed.`);
    }

    // List all members
    listMembers() {

        console.log("School Members:");

        this.members.forEach(member => {
            console.log(
                `ID: ${member.id}, Name: ${member.name}`
            );
        });
    }

    // Override describeRole()
    describeRole() {
        console.log(`${this.name} is the Principal and manages the school.`);
    }
}


// ================================
// Step 3: Teacher Class
// ================================

class Teacher extends Person {

    constructor(name, email, id, subject) {
        super(name, email, id);

        this.subject = subject;
        this.grades = [];
    }

    // Grade a student
    gradeStudent(student, grade) {

        this.grades.push({
            studentName: student.name,
            grade: grade
        });

        console.log(
            `${student.name} received grade ${grade}.`
        );
    }

    // List graded students
    listGrades() {

        console.log(`Grades given by ${this.name}:`);

        this.grades.forEach(record => {
            console.log(
                `${record.studentName}: ${record.grade}`
            );
        });
    }

    // Override describeRole()
    describeRole() {
        console.log(
            `${this.name} is a Teacher and teaches ${this.subject}.`
        );
    }
}

// Step 4: Student Class
class Student extends Person {

    constructor(name, email, id) {
        super(name, email, id);

        this.subjects = [];
    }

    // Enroll in a subject
    enrollSubject(subject) {

        this.subjects.push(subject);

        console.log(
            `${this.name} enrolled in ${subject}.`
        );
    }

    // View enrolled subjects
    viewSubjects() {

        console.log(
            `${this.name}'s enrolled subjects:`
        );

        this.subjects.forEach(subject => {
            console.log(subject);
        });
    }

    // Override describeRole()
    describeRole() {
        console.log(
            `${this.name} is a Student and is studying at the school.`
        );
    }
}

// Step 5: Create Objects

const principal = new Principal(
    "Ahmed",
    "ahmed@school.com",
    1
);

const teacher = new Teacher(
    "Sara",
    "sara@school.com",
    2,
    "Mathematics"
);

const student = new Student(
    "Omar",
    "omar@school.com",
    3
);

// Principal Actions
principal.addMember(teacher);
principal.addMember(student);

console.log();

principal.listMembers();

console.log();


// Teacher Actions

teacher.gradeStudent(student, 95);

teacher.gradeStudent(student, 88);

console.log();

teacher.listGrades();

console.log();

// Student Actions

student.enrollSubject("Mathematics");
student.enrollSubject("Physics");
student.enrollSubject("Computer Science");

console.log();

student.viewSubjects();

console.log();

// Polymorphism


const members = [
    principal,
    teacher,
    student
];

members.forEach(member => {
    member.describeRole();
});

