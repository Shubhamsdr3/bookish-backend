import axios from 'axios';
import { firestoreDB } from '../utils/init.js';


const apiKey = process.env.GOOGLE_BOOK_KEY;

export const bookService = {

    async searchBooks(searchTerms) {
        const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerms + '&filter=partial&key=' + apiKey;
        console.log("getting book suggestions.." + apiUrl);
        try {
          const { data: response } = await axios.get(apiUrl);
          console.log(JSON.stringify(response));
          return {
            isSuccess: true,
            data: response
          }
        } catch(error) {
          console.log(error)
          return {
            isSuccess: false,
            message: error.message
          }
        }
    },

    async getBookById(id) {
        try {
            console.log("Getting book by id: " + id);
            const apiUrl = 'https://www.googleapis.com/books/v1/volumes/' + id + '?key=' + apiKey;
            console.log("Making request to : " + apiUrl);
            const { data: response } = await axios.get(apiUrl);
            console.log("Saving response from places api..." + JSON.stringify(response));
                return {
                    isSuccess: true,
                data: response
            }
        } catch(err) {
            console.log(err)
            return {
                isSuccess: false,
                message: err
            }
        }
    }   
}