const express = require('express');
const router = express.Router();

const firestoreDB = require('../init');
const postCollection = firestoreDB.collection("posts")
const userCollection = firestoreDB.collection("users")

// create user
router.post('/createPost', async function(req, resp) {
    const userId = req.body.userId;
    const post = req.body.post;
    resp.setHeader("Content-Type", "application/json")
    resp.setHeader("Charset", "utf-8") 
    if(!userId || !post) {
        resp.status(200).json({"isSuccess": false, "data": "Error in adding doc."})
    }
    const userSnapshot = await userCollection.doc(userId).get();
    const userPost = {"user": userSnapshot.data(), "post": post}
    console.log("Creating post for userid " + userId + ":" + JSON.stringify(userPost));
     
    const postDocRef = await postCollection.add(userPost);
    postDocRef.get().then(snapShot => {
        console.log(snapShot.data())   
        resp.status(200).json({"isSuccess": true, "data": snapShot.data()})
    }).catch(error => {
        console.log(error)
        resp.status(200).json({"isSuccess": false, "data": "Error in adding doc."})
    })
})

module.exports = router