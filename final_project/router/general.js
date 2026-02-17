const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (!isValid(username)) {
        return res.status(404).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.status(200).json({ message: "User successfully registered" });
});


public_users.get('/', async function (req, res) {

    try {
        const bookList = await new Promise((resolve) => {
            resolve(books);
        });

        return res.status(200).json(bookList);

    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});


public_users.get('/isbn/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });

        return res.status(200).json(book);

    } catch (error) {
        return res.status(404).json({ message: error });
    }
});


public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author;

    try {
        const filteredBooks = await new Promise((resolve) => {

            const result = {};

            Object.keys(books).forEach(key => {
                if (books[key].author === author) {
                    result[key] = books[key];
                }
            });

            resolve(result);
        });

        return res.status(200).json(filteredBooks);

    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});


public_users.get('/title/:title', async function (req, res) {

    const title = req.params.title;

    try {
        const filteredBooks = await new Promise((resolve) => {

            const result = {};

            Object.keys(books).forEach(key => {
                if (books[key].title === title) {
                    result[key] = books[key];
                }
            });

            resolve(result);
        });

        return res.status(200).json(filteredBooks);

    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({ message: "Book not found" });
});


module.exports.general = public_users;
