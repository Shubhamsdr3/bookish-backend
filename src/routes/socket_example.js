const express = require('express');
const router = express.Router();

router.get('/socketMessage', (req, res) => {
    res.status(200).json({"is_success": true, "data": {"message": "This is message from socket",}})
});