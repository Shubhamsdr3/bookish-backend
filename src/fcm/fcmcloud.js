const admin = require('firebase-admin');

const sendNotification = (notificationData, successCallback, erorrCallback) => {
  console.log("FCM token: " + notificationData.token)
  const message = {
    data: notificationData,
    token: notificationData['token']
  };

  // Send message to device with provided registration token
  console.log("Sending message: " + JSON.stringify(message))
  admin.messaging().send(message)
    .then((response) => {
      console.log("Notification message Id: " + response)
      successCallback(response)
      // Response is a message ID string. 
      // eg: "name":"projects/myproject-b5ae1/messages/0:1500415314455276%31bd1c9631bd1c96"
    })
    .catch((error) => {
      // Delete token for user if error code is UNREGISTERED or INVALID_ARGUMENT
      if (error.errorCode == "messaging/invalid-argument" 
          || error.errorCode == "messaging/registration-token-not-registered") {
            // refresh the token
        Firebase.firestore.collection("fcmTokens").document(user.uid).delete() 
      } else {
        console.log(error)
      }
      erorrCallback(error)
    });
  }


const subscribeToTopic = (registrationTokens, topic, successCallback, erorrCallback) => {
  admin.messaging().subscribeToTopic(registrationTokens, topic)
  .then((response) => {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log('Successfully subscribed to topic:', response);
    successCallback(response);
  })
  .catch((error) => {
    console.log('Error subscribing to topic:', error);
    erorrCallback(error);
  });
}

const sendNotificationTopic = (topic, notificationData, successCallback, erorrCallback) => {
  const notificationMessage = {
    notification: {
      title: notificationData.title,
      body: notificationData.message
    },
    topic: topic
  }
  admin.messaging().send(notificationMessage)
  .then((response) => {
    console.log('Successfully sent message:', response);
    successCallback(response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
    erorrCallback(error);
});
}

module.exports = {
  sendNotification,
  subscribeToTopic,
  sendNotificationTopic
}
