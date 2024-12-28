export const categoryService = {
    
    async getCategories(req) {
        return {
            isSuccess: true,
            data: "Categories fetched successfully"
        }
    }
}