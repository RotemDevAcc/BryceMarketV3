import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { is_user_logged, loginAsync } from './loginSlice';


const Login = () => {

  const dispatch = useAppDispatch();
  const [userName, setusername] = useState("")
  const [password, setpassword] = useState("")
  const logged = useAppSelector(is_user_logged);
  const navigate = useNavigate()

  const login_user = async () => {
    const details = { userName: userName, password: password };

    try {
      dispatch(loginAsync(details));
    } catch (error) {
      // Handle any errors
      console.error('Login error:', error);
    }
  }

  return (
    <div>
      {!logged ? (
        <div className="container-fluid center-form">
          <div className="col-md-6 offset-md-3">
            <h1 className="text-center">Login</h1>

            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" onChange={(e) => setusername(e.target.value)} className="form-control" id="username" name="username" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" onChange={(e) => setpassword(e.target.value)} className="form-control" id="password" name="password" required />
            </div>
            <button type="submit" onClick={() => login_user()} className="btn btn-primary btn-block">Login</button>
            <p className="mt-3 text-center">
              Don't have an account? <Link to="/register">Create New Account</Link>
            </p>
          </div>
        </div>
      ) : <>{navigate("/")}</>}
    </div>
  );

}

export default Login