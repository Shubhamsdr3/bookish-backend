import { bookService } from '../services/bookService.js';
const apiKey = process.env.GOOGLE_BOOK_KEY;

export const bookController = {

    async searchBooks(req, res) {
        try {
            const books = await bookService.searchBooks(req.query.searchTerm);
            res.status(200).json({isSuccess: true, data: books});
        } catch (error) {
            res.status(500).json({ isSuccess: false, error: error.message });
        }
    },

    async getBookById(req, res) {
        try {
            const book = await bookService.getBookById(req.query.id);
            res.status(200).json({isSuccess: true, data: book});
        } catch (error) {
            res.status(404).json({isSuccess: false, error: error.message });
        }
    }
}; 