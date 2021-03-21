import firebase from "firebase/app";
import "firebase/auth";
import "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyD-tyi4B4mjxrHj-iSmjJSYKC4vhMe2Y9o",
  authDomain: "albeline-73d91.firebaseapp.com",
  projectId: "albeline-73d91",
  storageBucket: "albeline-73d91.appspot.com",
  messagingSenderId: "337863397033",
  appId: "1:337863397033:web:87c434ffa5ce1e2bd5e3b8",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().useDeviceLanguage();

export default firebase;
