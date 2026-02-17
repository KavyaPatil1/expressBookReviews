const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/allbooks");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


public_users.get('/allbooks', (req, res) => {
  return res.status(200).json(books);
});


public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/book/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});


public_users.get('/book/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({ message: "Book not found" });
});


public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/books/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Author not found" });
  }
});


/* Helper Route */
public_users.get('/books/author/:author', (req, res) => {

  const author = req.params.author;
  const result = {};

  Object.keys(books).forEach(key => {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "Author not found" });
  }

  return res.status(200).json(result);
});

public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/books/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Title not found" });
  }
});


public_users.get('/books/title/:title', (req, res) => {

  const title = req.params.title;
  const result = {};

  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "Title not found" });
  }

  return res.status(200).json(result);
});


module.exports.general = public_users;
