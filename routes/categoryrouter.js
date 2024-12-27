const e = require('express');
const express = require('express');
const router = express.Router();
const firestoreDB = require('../init');
const { TOPICS_COLLECTION, USER_TOPICS_COLLECTION, TOPIC_DOC_ID} = require('../utils/constants');

const topicCollection = firestoreDB.collection(TOPICS_COLLECTION)
const userTopicCollection = firestoreDB.collection(USER_TOPICS_COLLECTION)

// get all categories.
router.get('/book/topics', async function(req, res) {
    console.log("Getting book categories...")
    try {
        const responseJson = {}
        res.setHeader("Content-Type", "application/json")
        res.setHeader("Charset", "utf-8")
        const snapShot = await topicCollection.doc(TOPIC_DOC_ID).get()
        if(fictionSnapshot.exists) {
            const data = fictionSnapshot.data();
            responseJson["fictions"] = data['fictions']
            responseJson["nonFictions"] = data['nonFictions']
            res.status(200).json({"isSuccess": true, "data": responseJson})
        } else {
            res.status(200).json({"isSuccess": false, "data": "No data found"})
        }
    } catch(error) {
        console.log(error);
        res.status(200).json({"isSuccess": false, "data": error.meesage})
    }
})

router.post('/book/topics/subscribe/:userId',  async function(request, response) {
    console.log("Getting book categories...")
    try {
        const userId = request.params.userId;
        const finctionList = request.body.fictionList;
        const nonFictionList = request.body.nonFictionList;
        await userTopicCollection.doc(userId).set({"fictionList": finctionList, "nonFictionList": nonFictionList, "others": []})
        response.status(200).json({"isSuccess": true, "data": "Response success"})
    } catch(error) {
        console.log(error)
        response.status(200).json({"isSuccess": false, "data": error.meesage})
    }
})

module.exports = router