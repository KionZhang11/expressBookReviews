const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if username already exists
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Add new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

const axios = require('axios');

public_users.get('/', (req, res) => {
  axios.get('http://localhost:5000/internal/books')
    .then(response => {
      res.send(JSON.stringify(response.data, null, 2));
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to fetch books" });
    });
});

public_users.get('/internal/books', (req, res) => {
    res.json(books);
  });
  


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/internal/isbn/${isbn}`)
      .then(response => res.json(response.data))
      .catch(error => {
        res.status(error.response?.status || 500).json({ message: "Book not found or internal error" });
      });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    axios.get(`http://localhost:5000/internal/author/${author}`)
      .then(response => res.json(response.data))
      .catch(error => {
        res.status(error.response?.status || 500).json({ message: "No books found or internal error" });
      });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    axios.get(`http://localhost:5000/internal/title/${title}`)
      .then(response => res.json(response.data))
      .catch(error => {
        res.status(error.response?.status || 500).json({ message: "No books found or internal error" });
      });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      res.json(book.reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
