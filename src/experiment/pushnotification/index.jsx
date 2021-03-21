import React, { useEffect } from "react";
import firebase from "../../config/firebase";

export const PushNotification = () => {
  useEffect(() => {
    const messaging = firebase.messaging();
    messaging
      .requestPermission()
      .then(() => {
        return messaging.getToken();
      })
      .then((token) => {
        console.log("token", token);
      })
      .catch((error) => {
        console.error("error push notif", error);
      });
  }, []);

  return <div></div>;
};

// import React, { Component } from 'react'

// export default class PushNotification extends Component {
//   componentDidMount() {

//   }

//   render() {
//     return (
//       <div>

//       </div>
//     )
//   }
// }
