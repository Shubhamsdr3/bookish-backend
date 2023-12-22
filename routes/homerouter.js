const express = require('express');
const router = express.Router();
const homeFeed = require('../data/homefeed');
const firestoreDB = require('../init');
const { POST_COLLECTION } = require('../utils/constants');

const postCollections = firestoreDB.collection(POST_COLLECTION)
const readerCollection = firestoreDB.collection("readers")

const apiKey = process.env.GOOGLE_MAP_KEY

// get all workouts.
router.get('/home/feed', async function(req, resp) {
    console.log("Getting data for home feed..");
    resp.setHeader("Content-Type", "application/json")
    resp.setHeader("Charset", "utf-8")
    try {
        let postList = [];
        const snapshot = await postCollections.orderBy('createdAt', 'desc').get();
        snapshot.docs.map(doc => {
            console.log("User data: " + JSON.stringify(doc.data()));
            postList.push(doc.data());
        });
        resp.status(200).json({"isSuccess": true, "data": postList})
    } catch(error) {
        console.log(error);
        resp.status(200).json({"isSuccess": false, "data": error.meesage})
    }
})
  
module.exports = router