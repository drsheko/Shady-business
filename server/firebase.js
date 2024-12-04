const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfgyTbCd9OYlRuUjYr0o2czDPPsWgExuc",
  authDomain: "shady-business-ac1ec.firebaseapp.com",
  projectId: "shady-business-ac1ec",
  storageBucket: "shady-business-ac1ec.appspot.com",
  messagingSenderId: "580122065540",
  appId: "1:580122065540:web:578c4ced280d88b5eda0d1"
};

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
module.exports = getStorage(firebaseApp);