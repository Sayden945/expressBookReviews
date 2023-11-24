const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message:`${username} registered`});
        }
        else {
            return res.status(400).json({message:`User ${username} is existing user`});
        }
    }
    else {
        return res.status(404).json({message: "Please provide username and password"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filetered_books = Object.values(books).filter((book) => book.author === author);
    if (filetered_books.length > 0) {
        return res.send(filetered_books[0]);
    }
    else {
        return res.status(404).json({message: `${author} not found`});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filetered_books = Object.values(books).filter((book) => book.title === title);
    if (filetered_books.length > 0) {
        return res.send(filetered_books[0]);
    }
    else {
        return res.status(404).json({message: `${title} not found`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(books[isbn].reviews);
    }
    else {
        return res.status(404).json({message: `Book:${isbn} not found`});
    }
});

module.exports.general = public_users;
