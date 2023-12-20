import admin from 'firebase-admin';
require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA as string))
})

export default admin;
