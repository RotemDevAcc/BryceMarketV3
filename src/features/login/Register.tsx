import React, { useEffect, useState } from 'react'
import { is_user_logged } from './loginSlice';
import { useNavigate } from 'react-router-dom';
import { registerAsync, register_status, reset_status } from './registerSlice';
import { Message } from '../../Message';
import { useAppDispatch, useAppSelector } from '../../app/hooks';


const Register = () => {

    const dispatch = useAppDispatch();
    const logged = useAppSelector(is_user_logged);
    const status = useAppSelector(register_status)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        dob: '2000-01-01',
        gender: '',
        password: '',
        confirm_password: '',
    });

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    useEffect(() => {
      if(logged){
        navigate("/")
      }
    }, [navigate,logged])
    

    const RegisterAccount = () => {

        const uservalue = formData.username
        const fnamevalue = formData.firstname
        const lnamevalue = formData.lastname
        const emailvalue = formData.email
        const passvalue = formData.password
        const confirm_password = formData.confirm_password
        const gender = formData.gender
        const date = formData.dob
        if (!uservalue) {
            Message("Username was not entered", "error")
            return
        }
        if(!fnamevalue || !lnamevalue){
            Message("Firstname or Lastname weren't entered","error")
            return
        }

        if (!emailvalue) {
            Message("Email was not entered", "error")
            return
        }

        if (!passvalue) {
            Message("Password was not entered", "error")
            return
        }

        if (!confirm_password) {
            Message("Confirm Password was not entered", "error")
            return
        }

        if(passvalue !== confirm_password){
            Message("Passwords are not equal", "error")
            return
        }


        if (!gender || gender === "") {
            Message("Gender was not entered", "error")
            return
        }

        if (!date) {
            Message("Date was not entered", "error")
            return
        }
        dispatch(registerAsync(formData))
    }

    return (
        <div>
            {status !== "move" ? (
                <div className="container center-form">
                    <div className="col-md-6 offset-md-3">
                        <h1 className="text-center">Register</h1>

                        <div className="form-group">
                            <label htmlFor="username">
                                <i className="fas fa-user"></i> Username:
                            </label>
                            <input type="text" className="form-control" name="username" placeholder="karen123" onChange={handleInputChange} required/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <i className="fas fa-envelope"></i> Email Address:
                            </label>
                            <input type="email" className="form-control" name="email" placeholder="example@gmail.com" onChange={handleInputChange} required/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="firstname">
                                <i className="fas fa-id-card"></i> Firstname:
                            </label>
                            <input type="text" className="form-control" name="firstname" placeholder="avner" onChange={handleInputChange} required/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastname">
                                <i className="fas fa-user-circle"></i> Lastname:
                            </label>
                            <input type="text" className="form-control" name="lastname" placeholder="yeruham" onChange={handleInputChange} required/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">
                                <i className="fas fa-calendar-alt"></i> Birthdate:
                            </label>
                            <input type="date" className="form-control" name="dob" required onChange={handleInputChange} value="2000-01-01"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">
                                <i className="fas fa-venus-mars"></i> Gender:
                            </label>
                            <select defaultValue={''} name="gender" required onChange={handleInputChange}>
                                <option value='' disabled>Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <i className="fas fa-lock"></i> Password:
                            </label>
                            <input type="password" className="form-control" name="password" onChange={handleInputChange} required/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password">
                                <i className="fas fa-lock"></i> Confirm Password
                            </label>
                            <input type="password" className="form-control" name="confirm_password" onChange={handleInputChange} required/>
                        </div>

                        {status === '' ? 
                            <button type="submit" onClick={()=>RegisterAccount()} className="btn btn-primary btn-block">Register</button>
                            :
                            <button type="submit" onClick={()=>status === "rejected" ? dispatch(reset_status()) : Message("Register underway, Please Wait","error")} className='btn btn-warning btn-block'>{status}</button>
                        }
                        <p className="mt-3 text-center">already have an account? <a href="login.html">Login</a></p>
                    </div>
                </div>
            ) : <>{navigate("/login")}</>}
        </div>
    );

}

export default Register