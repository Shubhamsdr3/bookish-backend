const e = require('express');
const express = require('express');
const router = express.Router();

const firestoreDB = require('../init');
const { READER_COLLECTION } = require('../utils/constants');
const { POST_COLLECTION } = require('../utils/constants');
const postCollection = firestoreDB.collection(POST_COLLECTION)
const readerCollection = firestoreDB.collection(READER_COLLECTION)

// create user
router.post('/createPost', async function(req, resp) {
    const userId = req.body.userId;
    const previousPost = req.body.post;
    resp.setHeader("Content-Type", "application/json")
    resp.setHeader("Charset", "utf-8") 
    if(!userId || !previousPost) {
        resp.status(200).json({"isSuccess": false, "data": "Error in adding doc."})
    } else {
        const userSnapshot = await readerCollection.doc(userId).get();
        const postDocRef = postCollection.doc();
        console.log("Reader detail: " + userSnapshot.data());
        const postBody = Object.assign(
            previousPost, {
            "postId": postDocRef.id,
          })
        const userPost = {
            "reader": userSnapshot.data(), 
            "post": postBody, 
            'createdAt': new Date().getTime(), 
            "isLiked": req.body.isLiked,
            "like": {
                "icon": "",
                "text": "Like",
                "count": 0,
                "userIds": []
            },
            "comment": {
                "icon": "",
                "text": "Comment",
                "count": 0,
                "userIds": []
            },
            "share": {
                "icon": "",
                "text": "Like",
                "count": 0,
                "userIds": []
            }
        }
        console.log("Creating post for userid " + userId + ":" + JSON.stringify(userPost));
         postDocRef.set(userPost);
        postDocRef.get().then(snapShot => {
            console.log(snapShot.data())   
            resp.status(200).json({"isSuccess": true, "data": snapShot.data()})
        }).catch(error => {
            console.log(error)
            resp.status(200).json({"isSuccess": false, "data": "Error in adding doc."})
        })
    }
})

router.delete('/feed/delete', async function(req, res) {
    const postId = req.query.postId;
    console.log("Deleting post: " + postId);
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Charset", "utf-8") 
    if(!postId) {
        res.status(200).json({"isSuccess": false, "message": "Not a valid postId"});
    } else {
        try {
            await postCollection.doc(postId).delete();
            res.status(200).json({"isSuccess": true, "data": "Post deleted"});
        } catch(error) {
            res.status(200).json({"isSuccess": true, "message": error});
        }
    }
} )


module.exports = router