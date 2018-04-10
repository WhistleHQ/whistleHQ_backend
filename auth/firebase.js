
//setup Firebase
const admin = require('firebase-admin');
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FBASE_project_id,
  "private_key_id": process.env.FBASE_private_key_id,
  "private_key": process.env.FBASE_private_key,
  "client_email": process.env.FBASE_client_email,
  "client_id": process.env.FBASE_client_id,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FBASE_client_x509_cert_url
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  authDomain: process.env.FBASE_authDomain,
  databaseURL: process.env.FBASE_databaseURL,
  storageBucket: process.env.FBASE_storageBucket,
});

module.exports.fire = admin;