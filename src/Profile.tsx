import React, { ChangeEvent, useEffect, useState } from 'react';
import { selectDarkMode, toggleDarkMode } from './features/settings/darkModeSlice';
import { changeFullNameAsync, changePicAsync, get_user_details, get_user_token } from './features/login/loginSlice';
import { TargetServer } from './features/settings/settings';
import { Modal, Button } from 'react-bootstrap';
import { Message } from './Message';
import { useAppDispatch, useAppSelector } from './app/hooks';

const ModalTypes = {
    Clear: 0,
    NEW_PICTURE: 1,
    NEW_NAME: 2,
};

const Profile = () => {
    const dispatch = useAppDispatch();
    const myDetails = useAppSelector(get_user_details);
    const darkMode = useAppSelector(selectDarkMode);
    const token = useAppSelector(get_user_token)
    const [profileHeader, setProfileHeader] = useState<string | JSX.Element>('');
    const [profileButtons, setProfileButtons] = useState<JSX.Element | string>('');
    const [showModal, setShowModal] = useState(0);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);;
    const [firstName, setfirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const newPicture = () => {
        setShowModal(ModalTypes.NEW_PICTURE)
    };

    const ShowReceipts = () => {
        console.log("2");
    };

    const newName = () => {
        setShowModal(ModalTypes.NEW_NAME)
    };

    const handleNameFirstChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        setfirstName(event.target.value || '')
    }
    const handleNameLastChange = (event: ChangeEvent<HTMLInputElement>) => {
        setlastName(event.target.value || '')
    }


    const handleIMGClose = () => {
        setShowModal(ModalTypes.Clear)
        setSelectedImage(null);
    }

    const handleIMGCancel = () => {
        setShowModal(ModalTypes.Clear)
        setSelectedImage(null);
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) setSelectedImage(file);
    };

    const handleIMGConfirm = () => {
        if (selectedImage) {
            const imageFile = selectedImage
            if (!imageFile) {
                Message("An image was not provided.", "error");
                return;
            }

            // Check file format and size
            const allowedFormats = ['.png'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            // Validate file format based on allowedFormats
            const isValidFormat = allowedFormats.some(format => imageFile.name.toLowerCase().endsWith(format));

            if (!isValidFormat) {
                Message("Please upload a PNG image.", "error");
            } else if (imageFile.size > maxSize) {
                Message("Image size must be less than 2MB.", "error");
            } else {
                // Use fetch or other methods to send the form data to the server
                handleIMGClose()
                const formData = new FormData();
                formData.append('img', imageFile);
                formData.append('rtype', "newpicture");
                formData.append('token', token);
                dispatch(changePicAsync(formData))
            }
        } else {
            Message("No Image Sent", "error")
        }
        console.log(selectedImage)
    }

    const handleNameCancel = () => {
        setShowModal(ModalTypes.Clear)
    }

    const handleNameConfirm = () => {
        const fullname = (myDetails && myDetails.firstname + " " + myDetails.lastname) || "None"
        const firstname = firstName
        const lastname = lastName

        if (!firstname || !lastname) {
            Message("Firstname And Lastname must be specified", "error")
            return
        }

        const fakename = `${firstname} ${lastname}`

        if (fakename === fullname) {
            Message("Your New Name cant be the same as your current name.", "error")
            return
        }

        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('token', token);
        formData.append('rtype', "newname");
        setShowModal(ModalTypes.Clear)
        dispatch(changeFullNameAsync(formData))
    }

    useEffect(() => {
        if (!myDetails.username) {
            setProfileHeader(
                <>
                    You must be logged in to use this page
                    {/* <NavLink to="/login" className="nav-link">
                        Click Here
                    </NavLink> */}
                </>
            );
        } else {
            const fullname = myDetails.firstname + ' ' + myDetails.lastname;
            setProfileHeader(
                <>
                    Welcome {fullname} To Your Profile
                    <br />
                    Choose Your Actions:
                </>
            );

            const profilePicture = myDetails.img || 'placeholder.png';

            setProfileButtons(
                <div>
                    <h3>Your Picture</h3>
                    <div className="card" style={{ width: '18rem' }}>
                        <img
                            src={`${TargetServer}/static/images/${profilePicture}`}
                            className="card-img-top"
                            alt="Profile Pic"
                        />
                        <div className="card-body">
                            <h5 className="card-title">{myDetails.username}</h5>
                            <button className="btn btn-primary" onClick={newPicture}>
                                Change Picture
                            </button>
                        </div>
                    </div>
                    <div>
                        <button id="receiptButton" className="btn btn-success" onClick={ShowReceipts}>
                            My Receipts
                        </button>
                        <ul>
                            <li>
                                <i className="fas fa-user"></i> Username: {myDetails.username}
                            </li>
                            <li>
                                <i className="fas fa-envelope"></i> Email: {myDetails.email}
                            </li>
                            <li>
                                <i className="fas fa-calendar-alt"></i> Date Of Birth: {myDetails.dob}
                            </li>
                            <li>
                                <i className="fas fa-venus-mars"></i> Gender: {myDetails.gender}
                            </li>
                            <li>
                                <i className="fas fa-id-card"></i> Fullname: {fullname}
                                <br />
                                <button className="btn btn-primary" onClick={newName}>
                                    Change Name
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            );

            // Rest of your initialization logic

            if (myDetails.is_staff) {
                // Additional logic for staff
            }
        }
    }, [myDetails]);


    return (
        <div>
            <div className="container mt-4">
                <h2>{profileHeader}</h2>
                <br />
                <br />
                <ul className="list-group">
                    {profileButtons}
                </ul>
            </div>

            <div className="container mt-4">
                <h2>Settings:</h2>
                <button className={darkMode ? "btn btn-primary" : "btn btn-secondary"} onClick={() => dispatch(toggleDarkMode())}>
                    {darkMode ? 'Normal Mode' : 'Dark Mode'}
                </button>
            </div>
            <Modal show={showModal === ModalTypes.NEW_PICTURE} onHide={handleIMGCancel}>
                <Modal.Header>
                    <Modal.Title>Change Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="changeImgForm">
                        <label htmlFor="changeImgImage">Image (PNG format, max 2MB):</label>
                        <input
                            type="file"
                            id="changeImgImage"
                            name="changeImgImage"
                            accept=".png"
                            onChange={handleImageChange}
                            required
                        />
                        <br />
                        <Button variant="primary" onClick={() => handleIMGConfirm()}>
                            Change Image
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleIMGCancel}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal === ModalTypes.NEW_NAME} onHide={handleNameCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="changeNameForm">
                        <label htmlFor="changeNameFirst">Firstname:</label>
                        <input
                            type="text"
                            id="changeNameFirst"
                            name="changeNameFirst"
                            value={firstName}
                            onChange={handleNameFirstChange}
                            required
                        />
                        <br />
                        <label htmlFor="changeNameLast">Lastname:</label>
                        <input
                            type="text"
                            id="changeNameLast"
                            name="changeNameLast"
                            value={lastName}
                            onChange={handleNameLastChange}
                            required
                        />
                        <br />
                        <Button variant="primary" onClick={handleNameConfirm}>
                            Change Name
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Profile;
