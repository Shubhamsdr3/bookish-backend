export const categoryController = {
    async getCategories(req, res) {
        return res.status(200).json({ message: 'Categories fetched successfully' });
    }
}