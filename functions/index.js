const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore()
// const userRef = db.collection('users').doc(id)
// const getUser = userRef.get
//     .then(snapshot => snapshot.data())
//     .then( user => {
//         return user.id 
//     })


exports.notifyUser =  functions.firestore.document('/chatrooms/{documentId}/messages/{messageId}')
    .onCreate(event => {
    
        console.log('----------------------------------');
        console.log(event);

        const message = event.data();
        const userId = message.recipientId

        const payload = {
            notification : {
                title : 'New Message!',
                body : `${message.sender.firstName}`,
                icon : `${message.sender.photoUrl}`,
            }

        }

        //ref to the parent document
        const db = admin.firestore()
        const userRef = db.collection('users').doc(userId)


        return userRef.get()
            .then(snapshot => snapshot.data())
            .then( user => {
                const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
                if(!tokens.length) {
                    throw new Error('User does not have tokens!')
                }
                return admin.messaging().sendToDevice(tokens, payload)
            })
            .catch(err => console.log(err));

});
