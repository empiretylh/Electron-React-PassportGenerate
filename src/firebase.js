import admin from 'firebase-admin'

var serviceAccount = require("./pascal-bea2e-firebase-adminsdk-ei62n-7573fa85ee.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const firestore = admin.firestore()

export default firestore;