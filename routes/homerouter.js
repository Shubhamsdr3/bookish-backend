const express = require('express');
const router = express.Router();
const homeFeed = require('../data/homefeed');
const firestoreDB = require('../init');
const postCollections = firestoreDB.collection("posts")

// get all workouts.
router.get('/home/feed', async function(req, resp) {
    console.log("Getting data for home feed..");
    let postList = [];
    const snapshot = await postCollections.get();
    snapshot.docs.map(doc => {
        console.log("User data: " + doc.data());
        postList.push(doc.data());
    });
    resp.setHeader("Content-Type", "application/json")
    resp.setHeader("Charset", "utf-8")
    resp.status(200).json({"isSuccess": true, "data": postList})
})

module.exports = router