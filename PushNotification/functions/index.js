const functions = require("firebase-functions");
const admin  = require("firebase-admin");
admin.initializeApp();

// exports.androidPushNotification = functions.firestore.document("Notifications/{docId}").onCreate(
//     (snapshot, context) =>{
//         admin.messaging().sendToTopic(
//             "new_user_forums",
//             {
//                 notification: {
//                     title: snapshot.data.title,
//                     body: snapshot.data.body
//                 }
//             }
//         )
//     }
// ); // subcribe to topic


// using token registration
exports.androidPushNotification = functions.firestore.document("Notifications/{docId}").onCreate(
    (snapshot, context) => {
        admin.firestore().collection("DeviceTokens").get().then(
            result => {
                var registrationTokens = [];
                result.docs.forEach(
                    tokenDocument => {
                        registrationTokens.push(tokenDocument.data().token);
                    }
                );   
                admin.messaging().sendMulticast(
                    {
                        tokens: registrationTokens,
                        notification: {
                            title: snapshot.data().title,
                            body: snapshot.data().body
                        }
                    }
                );
            }
        );
    }
);
