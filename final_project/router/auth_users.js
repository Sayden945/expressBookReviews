const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean if valid username

    let userwithsamename = users.filter((user) =>{
        return user.username === username;
    });
    if(userwithsamename.length > 0){
        return true;
    }
    else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean if details match a user
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    }
    else{
        return false;
    }
}

//only registered users can login
//Create access token for authorisation
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //If username or password not entered return try again message
  if(!username || !password)
  {
    return res.status(404).json({message: "Login error, please try again"});
  }

  //If details match create access token
  if(authenticatedUser(username,password)){
      let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});

      req.session.authorization  = { accessToken, username}

      return res.status(200).json({message: "Successfully logged in"});
  }
  else{ //If not a user/details incorrect try again
  return res.status(208).json({ 
      message: "Invalid login, check username or password"
    });
}});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Successfully posted review");
    }
    else {
        return res.status(404).json({message: `Book: ${isbn} not found`});
    }
});

//Delete Review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        return res.status(200).send("Successfully deleted review");
    }
    else {
        return res.status(404).json({message: `Book: ${isbn} not found`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
