import admin from 'firebase-admin'

var serviceAccount = require("./pascaljsonsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const firestore = admin.firestore()

console.log(firestore,'Fire store;;;;;;')

export default firestore;
