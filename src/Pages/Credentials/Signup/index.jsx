import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../../../config/firebase";
import PulseLoader from "react-spinners/PulseLoader";
import { css } from "@emotion/react";
import Swal from "sweetalert2";
import Axios from "axios";
import { config } from "../../../config";
import { useHistory } from "react-router-dom";

const Signup = ({ onBack, toLogin }) => {
  const dispatch = useDispatch();
  const CredentialPopup = useSelector((state) => state.CredentialPopup);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vermethod, setVermethod] = useState("email");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [reset, setReset] = useState(false);

  let history = useHistory();

  function changeVermethod(e) {
    setVermethod(e.target.value);
  }

  
  function sendOTP() {
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", {
      'size': 'normal',
      'expired-callback': () => {
        Swal.fire({
          icon: 'error',
          title: 'Status Expired',
          text: 'the response to the server has been expired, try again'
        });
      }
    });

    if (reset) {
      // document.getElementById('recaptcha').style.display = "block";
      recaptchaVerifier.render().then(function(widgetId) {
        window.recaptchaWidgetId = widgetId;
      });
      setReset(false);
    }

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then((e) => {
        Swal.fire({
          title: 'Insert OTP code we\'ve sent to you',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'got it',
          showLoaderOnConfirm: true,
          preConfirm: (code) => {
            return e.confirm(code)
            .then(response => {
                console.log('response firebase', response)
                return response;
              })
              .catch(error => {
                Swal.showValidationMessage(`you're inserting wrong code`)
              })
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          let timerInterval;
          Swal.fire({
            icon: 'success',
            title: 'success',
            text: 'Phone number successfuly authorized',
            html: 'close in <b></b>',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              timerInterval = setInterval(() => {
                const content = Swal.getContent();
                if (content) {
                  const b = content.querySelector('b');
                  if (b) {
                    b.textContent = Swal.getTimerLeft()
                  }
                }
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then(() => {
            // document.getElementById('recaptcha').style.display = "none";
          });
          setVerified(true);
        })

        // let code = prompt(
          //   "Insert the code we've sent to your phone number",
          //   ""
          // );
        // if (code === null) return;
        // e.confirm(code)
        //   .then((result) => {
          //     Swal.fire({
        //       icon: "success",
        //       title: "Success",
        //       text: `${result.user.phoneNumber} is Authorized`,
        //     });
        //   })
        //   .catch((e) => {
        //     Swal.fire({
        //       icon: "error",
        //       title: "Failed",
        //       text: `${e}`,
        //     });
        //   });
      })
      .catch(e => {
        Swal.fire({
          icon: 'error',
          title: `Error ${e.code}`,
          text: `${e.message}. try again`
        }).then(e => {
          recaptchaVerifier.reset();
        });
      })
  }

  async function register(e) {
    e.preventDefault();

    let username = document.getElementById('username-input').value;

    if (vermethod === 'email') {
      var email = document.getElementById('email-input').value;
    } else {
      var phone = document.getElementById('number-input').value.trim();
    }

    let password = document.getElementById('pass-input').value;
    let c_password = document.getElementById('confirm-pass-input').value;

    let url = `${config.api_host}/api/register`;
    let body = {
      username,
      password,
      c_password
    }
    console.log('vermethod', vermethod);
    if (vermethod === "email") {
      body = {...body, email}
    } else {
      body = {...body, hp: phone}
    }
    console.log('body', body);

    if(password !== c_password) {
      Swal.fire('passwords do not match');
      setReset(true);
      return;
    }
    
    setLoading(true);
    if (vermethod !== "email" && !verified) {
      alert('you must verified your phone number');
      return false;
    }
    try {
      const response = await Axios.post(url, body);
      if (vermethod === "email") {
        Swal.fire({icon: 'success', title: 'Check your mailbox', text: 'Check the verification email we\'sent to your mailbox'});
        dispatch({type: 'CREDENTIAL_POPUP', open: false});
      } else {
        setVerified(false);
        Swal.fire({icon: 'success', title: 'Successfully create an account!'});
        dispatch({type: 'CREDENTIAL_POPUP', open: false});
      }
    } catch(e) {
      if(e.response) {
        Swal.fire({icon: 'error', title: `Ooops... an error occured`});
      } else {
        Swal.fire({icon: 'error', title: `An error occured`});
      }
      setVerified(false);
    }
    setLoading(false)
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
              <span className="big-text">Hello There!</span>
              <span className="small-text">
                If you already have an account please login with your personal
                info
              </span>
              <button onClick={toLogin}>
                <span>Sign In</span>
              </button>
            </div>
          </div>
          <div className="r-panel">
            <div className="content">
              <span className="big-text">Create Account</span>
              <span className="small-text">
                Doesn't have an account? It takes less than a minute. If you
                already have an account Login
              </span>
              <div className="input-signup">
                <div className="border-input">
                  <input
                    type="text"
                    id="username-input"
                    placeholder="Username"
                  />
                </div>
                <div
                  className={
                    vermethod === "email"
                      ? "border-input"
                      : "border-input otp-input"
                  }
                >
                  {vermethod === "email" ? (
                    <input
                      type="text"
                      id="email-input"
                      placeholder="Email Address"
                    />
                  ) : (
                    <Fragment>
                      <input
                        type="text"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        id="number-input"
                        placeholder="i.e. +6281234567890"
                      />
                      <button onClick={sendOTP}>Send OTP</button>
                    </Fragment>
                  )}
                  <div className="select-vermethod">
                    <select
                      onChange={changeVermethod}
                      value={vermethod}
                      name="vermthod"
                      id="vermethod"
                    >
                      <option value="email">email</option>
                      <option value="phone">phone (OTP)</option>
                    </select>
                  </div>
                </div>
                <div className="border-input">
                  <input type="password" id="pass-input" placeholder="Password" />
                </div>
                <div className="border-input">
                  <input
                    type="password"
                    id="confirm-pass-input"
                    placeholder="Re-enter Password"
                  />
                </div>
                <div className="recaptcha" id="recaptcha"></div>
              </div>
              {console.log('verified', verified)}
              <button className="submit-signup" onClick={register} disabled={loading || vermethod !== "email" && !verified}>{loading ? <PulseLoader color="#ffffff" size="8" loading={loading} /> : "Create Account"}</button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Signup;
