import React, { useMemo } from 'react'
import { Redirect, Route } from 'react-router-dom'
import Cookie from 'universal-cookie';
var cookies = new Cookie();

export const AuthGuarder = ({ children, ...rest }) => {
  const login = cookies.get('login');

  useMemo(() => {
    console.log('login', login);
  }, [login]);

  return (
    <div>
      <Route {...rest}>{!login ? <Redirect to="/" /> : children}</Route>
    </div>
  )
}

export default AuthGuarder;