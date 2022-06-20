  import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyArfHzZoa-5uTBpWo5-XofHmTxt4v6oFKo",
    authDomain: "insta-clone-aks.firebaseapp.com",
    projectId: "insta-clone-aks",
    storageBucket: "insta-clone-aks.appspot.com",
    messagingSenderId: "1090973140304",
    appId: "1:1090973140304:web:957f8ef96d6b237aa61855",
    measurementId: "G-47J7BBSRMC"
  });

  const db=firebaseApp.firestore();
  const auth= firebase.auth();
  const storage= firebase.storage();

 export {db,auth,storage};