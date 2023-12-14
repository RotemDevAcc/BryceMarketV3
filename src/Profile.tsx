import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkMode, toggleDarkMode } from './features/settings/darkModeSlice';
import { UserDetails, get_user_details } from './features/login/loginSlice';


const init = (myDetails:UserDetails, setProfileHeader:Function, dispatch:Function) => {
    if (!myDetails.username) {
        setProfileHeader(
            <>
                You must be logged in to use this page

                {/* <li className={`nav-item active`}>
                    <NavLink to="/login" className="nav-link">
                        Click Here
                    </NavLink>
                </li> */}
            </>
        );
        return;
    }

    const fullname = myDetails.firstname + ' ' + myDetails.lastname;

    setProfileHeader(
        <>
            Welcome {fullname} To Your Profile
            <br />
            Choose Your Actions:
        </>
    );

    // Rest of your initialization logic

    if (myDetails.is_staff) {
        // Additional logic for staff
    }
};

const Profile = () => {
    const dispatch = useDispatch();
    const myDetails = useSelector(get_user_details);
    const darkMode = useSelector(selectDarkMode)
    const [profileHeader, setProfileHeader] = useState('');

    useEffect(() => {
        init(myDetails, setProfileHeader, dispatch);
    }, [myDetails, dispatch]);



    // Rest of your functions go here

    return (
        <div>
            <div className="container mt-4">
                <h2>{profileHeader}</h2>
                <br />
                <br />
                <ul className="list-group">
                    {/* Receipts will be dynamically added here */}
                </ul>
            </div>

            <div className="container mt-4">
                <h2>Settings:</h2>
                <button className={darkMode ? "btn btn-primary": "btn btn-secondary"} onClick={() => dispatch(toggleDarkMode())}>
                    {darkMode ? 'Normal Mode' : 'Dark Mode'}
                </button>
            </div>

            {/* Modals and forms go here */}
            <div className="modal fade" tabIndex={-1} role="dialog" aria-hidden="true">
                {/* Modal content */}
            </div>
        </div>
    );
};

export default Profile;
