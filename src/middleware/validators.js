export const validateBookId = (req, res, next) => {
    if (!req.query.id) {
        return res.status(400).json({ error: "Book ID is required" });
    }
    next();
}