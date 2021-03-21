import Axios from "axios";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Cookie from 'universal-cookie';
import PulseLoader from 'react-spinners/PulseLoader';
import { config } from "../../../config";
var cookies = new Cookie();

const ForgotPassword = ({ onBack, toLogin }) => {
  const CredentialPopup = useSelector((state) => state.CredentialPopup);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const sendEmail = async (e) => {
    e.preventDefault();

    let url = `${config.api_host}/api/password/email`;
    let body = {email}
    
    setLoading(true);
    console.log('body', body)
    try {
      const response = await Axios.post(url, body);
      Swal.fire({icon: 'success', title: 'Already Sent', text: response.data.data})
      dispatch({type: "POPUP_TYPE", popup: "login"});
      setLoading(false);
    } catch (error) {
      console.log('error', error)
      if (error.response) {
        console.log('error.response.data', error.response.data)
        if (error.response.status === 422) {
          if (error.response.data.message.email) {
            Swal.fire({icon: 'error', title: 'Oops...', text: `${error.response.data.message.email[0]}`});  
          } else if (error.response.data.message === "Please wait before retrying.") {
            Swal.fire({icon: 'error', title: 'Oops...', text: "Please wait 60 seconds before retrying."});
          } else {
            Swal.fire({icon: 'error', text: `${error.response.data.message}`});
          }
        }
        if (error.response.status === 500) {
          Swal.fire({icon: 'error', title: 'Connection error', text: 'Make sure you have an active internet connections'});
        }
      }
      setLoading(false);
    }
  }

  return (
    <Fragment>
      {CredentialPopup.open && (
        <div className="login-modal">
          <div className="l-panel">
            <button className="popup-back" onClick={onBack}>
              <i className="fas fa-long-arrow-alt-left"></i>
            </button>
            <div className="content">
              <span className="big-text">Try to Remember!</span>
              <span className="small-text">
                Already remembered your password? Let's go back login.
              </span>
              <button onClick={toLogin}>
                <span>Login</span>
              </button>
            </div>
          </div>
          <div className="r-panel">
            <div className="content">
              <span className="big-text">Forgot Password</span>
              <span className="small-text">
                Enter your email address, we will send the password reset link to your mailbox
              </span>
              <form className="input-signup" onSubmit={sendEmail}>
                <div className="border-input">
                  <input type="text" id="email-input" onChange={e => setEmail(e.target.value)} placeholder="Email Address"/>
                </div>
                <button className="submit-signin" type="submit" disabled={loading}>{loading ? <PulseLoader color="#ffffff" size="8" loading={loading} /> : "Send Reset Link"}</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ForgotPassword;