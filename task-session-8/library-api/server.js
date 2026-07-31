const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "books.json");


// ================================
// Read Books
// ================================

function readBooks() {
    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);
}


// ================================
// Save Books
// ================================

function saveBooks(books) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(books, null, 2)
    );
}


// ================================
// Create Server
// ================================

const server = http.createServer((req, res) => {

    const { method, url } = req;


    // ================================
    // GET /books
    // ================================

    if (method === "GET" && url === "/books") {

        try {

            const books = readBooks();

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(books));

        } catch (error) {

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Error reading books"
            }));
        }

        return;
    }


    // ================================
    // POST /books
    // ================================

    if (method === "POST" && url === "/books") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const data = JSON.parse(body);

                // Validate required fields
                if (
                    !data.title ||
                    !data.author ||
                    data.price === undefined ||
                    data.available === undefined
                ) {

                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        message: "Missing book data"
                    }));

                    return;
                }


                const books = readBooks();


                // Generate ID
                let newId = 1;

                if (books.length > 0) {

                    newId = books[books.length - 1].id + 1;
                }


                // Create new book
                const newBook = {
                    id: newId,
                    title: data.title,
                    author: data.author,
                    price: data.price,
                    available: data.available
                };


                // Add book
                books.push(newBook);


                // Save
                saveBooks(books);


                // Response
                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify(newBook));


            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON"
                }));
            }
        });

        return;
    }


    // ================================
    // DELETE /books/:id
    // ================================

    if (method === "DELETE" && url.startsWith("/books/")) {

        try {

            // Get ID from URL
            const id = Number(
                url.split("/")[2]
            );


            const books = readBooks();


            // Find book
            const index = books.findIndex(
                book => book.id === id
            );


            // Book not found
            if (index === -1) {

                res.writeHead(404, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Book not found"
                }));

                return;
            }


            // Remove book
            const deletedBook = books.splice(index, 1)[0];


            // Save updated books
            saveBooks(books);


            // Response
            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Book deleted successfully",
                book: deletedBook
            }));


        } catch (error) {

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Error deleting book"
            }));
        }

        return;
    }


    // ================================
    // Invalid Route
    // ================================

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        message: "Route not found"
    }));
});


// ================================
// Start Server
// ================================

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});