import { TOPICS_COLLECTION, USER_TOPICS_COLLECTION, TOPIC_DOC_ID} from '../utils/constants.js';
import { firestoreDB } from '../utils/init.js';
const topicCollection = firestoreDB.collection(TOPICS_COLLECTION)
const userTopicCollection = firestoreDB.collection(USER_TOPICS_COLLECTION)

export const categoryService = {

    async getCategories() {
        console.log("Getting book categories...")
        try {
            const responseJson = {}
            const snapShot = await topicCollection.doc(TOPIC_DOC_ID).get()
            if(snapShot.exists) {
                const data = snapShot.data();
                responseJson["fictions"] = data['fictions']
                responseJson["nonFictions"] = data['nonFictions']
            }
            return {
                isSuccess: true,
                data: responseJson
            }
        } catch(error) {
            console.log(error)
            return {
                isSuccess: false,
                data: error.meesage
            }
        }
    },

    async subscribeToTopic(req) {
        console.log("Subscribing to topic...")
        try {
            const userId = req.params.userId;
            const finctionList = req.body.fictionList;
            const nonFictionList = req.body.nonFictionList;
            await userTopicCollection.doc(userId).set({"fictionList": finctionList, "nonFictionList": nonFictionList, "others": []})
            return {
                isSuccess: true,
                data: "Response success"
            }
        } catch(error) {
            console.log(error)
            return {
                isSuccess: false,
                data: error.meesage
            }
        }
    }
}