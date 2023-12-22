const express = require('express');
const bookRouter = express.Router();
const axios = require('axios');
const firestoreDB = require('../init');

const apiKey = process.env.GOOGLE_BOOK_KEY

// search suggesion
bookRouter.get('/reader/book/search', async function(req, res) {
  let searchTerms = req.query.searchTerms;
  const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerms + '&filter=partial&key=' + apiKey;
  console.log("getting book suggestions.." + apiUrl);
  res.setHeader("Content-Type", "application/json")
  try {
    const { data: response } = await axios.get(apiUrl);
    console.log(JSON.stringify(response));
    res.status(200).json({"is_success": true, "data": response})
  } catch(error) {
    console.log(error)
    res.status(200).json({"is_success": false, "data": error})
  }
})

// getting book by id.
bookRouter.get('/reader/book', async function(req, res) {
    console.log("Getting book info...");
    fetchBookById(res);
})

async function fetchBookById(resp) {
  const apiUrl = 'https://www.googleapis.com/books/v1/volumes/dsz5AwAAQBAJ?key=' + apiKey;
  console.log("Making request to : " + apiUrl);
   axios.get(apiUrl)
          .then(response => {
            processResponse(response.data, resp);
          })
          .catch(error => {
            console.log(error.message);
            resp.status(200).json({"is_success": false, "message": error});
          }
      );
  }
  
  async function processResponse(bookInfo, resp) {
    try {
      console.log("Saving response from places api..." + JSON.stringify(bookInfo));
      resp.status(200).json({"is_success": true, "data": bookInfo})
    } catch(err) {
      console.log(err)
      resp.status(200).json({"is_success": false, "message": err})
    }
  }
  
  module.exports = bookRouter