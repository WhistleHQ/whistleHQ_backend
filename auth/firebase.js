
//setup Firebase
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_AUTH);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  authDomain: "whistlehq-si660.firebaseio.com",
  databaseURL: "https://whistlehq-si660.firebaseio.com/",
  storageBucket: "whistlehq-si660.appspot.com"
});

module.exports.fire = admin;