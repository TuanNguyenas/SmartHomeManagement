const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

const initializeFirebase = () => {
  console.log(serviceAccount);
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase initialized");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
};

module.exports = { initializeFirebase };
