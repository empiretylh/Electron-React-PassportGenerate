const admin = require('firebase-admin');

var serviceAccount = require(".\\pascaljsonsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId:'pascal-bea2e'
});


const firestore = admin.firestore()

console.log(firestore,'Fire store;;;;;;')


const collectionRef = firestore.collection('Pascal_Database');
const documentRef = collectionRef.doc();

documentRef
  .set({
    phoneno: "09888888",
    avaliable: false,
  }).then(res=>console.log(res)).catch(err=>console.log(err))