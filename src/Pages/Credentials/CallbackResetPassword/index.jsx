import Axios from 'axios';
import React, { Fragment } from 'react'
import { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from 'react-spinners/PulseLoader';
import { config } from '../../../config';

const ResetPassword = () => {
  let { token, email } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  let history = useHistory();

  const submitResetPassword = async () => {
    let url = `${config.api_host}/api/password/reset`;
    let body = {token, email, password}

    if (confirmPassword !== password) {
      Swal.fire({icon: 'error', title: 'Passwords do not match', text: 'Your password confirmation & password are not same'});
      return false;
    }
    
    setLoading(true)
    try {
      await Axios.post(url, body);
      Swal.fire({icon: 'success', title: 'Password Changed', text: 'your password successfuly changed', allowOutsideClick: false}).then(() => {history.push('/')});
    } catch (error) {
      console.error(error);
      if (error.response) {
        Swal.fire({icon: 'error', title: 'Oops...', text: error.response.data.message});
      }
    }
    setLoading(false)
  }

  return (
    <Fragment>
      <section className="reset-sect" style={{ minHeight: '85vh' }}>
        <div className="reset-box">
          <h2>Reset Your Password</h2>
          <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
          <input type="password" className="reset-pass-conf" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)}/>
          <button onClick={submitResetPassword}>{loading ? <Loader size="10px" color="#fff" />: 'Reset Password'}</button>
          <Link to="/">Back Home</Link>
        </div>
      </section>
    </Fragment>
  )
}

export default ResetPassword;