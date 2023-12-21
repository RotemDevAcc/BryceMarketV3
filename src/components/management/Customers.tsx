import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { get_user_token } from '../login/loginSlice'
import { AdminremoveUserAsync, editAdminStaffAsync, getAdminCustomersAsync, get_admin_customers, selectastatus, updateStatus } from './managementSlice'
import { faEdit, faReceipt, faRemove } from '@fortawesome/free-solid-svg-icons'
import { TargetServer } from '../settings/settings'
import { Message } from '../../Message'
import { Button, Modal } from 'react-bootstrap'

const Modals = {
    Receipts: 1,
    edituser: 2,
    deleteuser: 3,
    hide: 0
}

const Customers = () => {
    const [searchuser, setsearchuser] = useState('')

    const [userList, setuserList] = useState<JSX.Element[]>([]);
    const [editList, seteditList] = useState<JSX.Element[]>([]);
    const [deletetitle, setdeletetitle] = useState('')
    const [deleteBody, setdeleteBody] = useState<JSX.Element[]>([]);
    const dispatch = useAppDispatch()
    const token = useAppSelector(get_user_token)
    const customers = useAppSelector(get_admin_customers)
    const status = useAppSelector(selectastatus)
    const [showmodal, setshowmodal] = useState(Modals.hide)



    const toggleStaff = useCallback((userid: number, set: boolean) => {
        dispatch(editAdminStaffAsync({ userid, set, token }))
        setshowmodal(Modals.hide)
    }, [dispatch, token])


    const GetUser = useCallback((userID: number) => {
        const foundUser = customers.find(user => user.id === userID);
        return foundUser ? foundUser : null;
    }, [customers])

    const editUser = useCallback((userid: number) => {
        const user = GetUser(userid)
        if (!user) {
            Message("User Not Found", "error")
            return
        }

        const staffbutton = user.is_staff ?
            <div>
                <button className="btn btn-warning" onClick={() => toggleStaff(user.id, false)}>Remove Staff</button>
            </div> :
            <div>
                <button className="btn btn-success" onClick={() => toggleStaff(user.id, true)}>Set Staff</button>
            </div>
        const editlist = (<div key={"edit"}>
            <br />
            <img src={`${TargetServer}${user.img}`} width={"50px"} height={"50px"} style={{ borderRadius: "15px" }} alt='User Avatar'></img><br />
            <strong>Username:</strong> {user.username}<br />
            <strong>Email:</strong> {user.email}<br />
            <strong>Staff:</strong> {user.is_staff}<br />{staffbutton}
        </div>)

        seteditList([editlist])
        setshowmodal(Modals.edituser)
        // modal.show()
    }, [GetUser, toggleStaff])

    const handleRemoveUser = useCallback((userid: number) => {
        setshowmodal(Modals.hide);
        dispatch(AdminremoveUserAsync({ userid: userid, token: token }));
    }, [dispatch, token]);

    const deleteUser = useCallback((user: any) => {
        if (!user || user.length === 0) {
            Message("User Not Found", "error")
            return
        }

        setdeletetitle("Are you sure you want to delete this user?")

        const deletebody =
            <div key={"deleteuser"}>
                Username: {user.username}<br />
                Email: {user.email}<br />
                UserID: {user.id}<br />
                <button className="btn btn-primary" onClick={() => handleRemoveUser(user.id)}>Delete User{" "}<FontAwesomeIcon icon={faRemove} /></button>{" "}
            </div>
        setdeleteBody([deletebody])
        setshowmodal(Modals.deleteuser)
    }, [handleRemoveUser])
    const userReceipts = (userid: number) => {

    }



    useEffect(() => {
        dispatch(updateStatus("pending"))
        dispatch(getAdminCustomersAsync(token))
    }, [dispatch, token])

    useEffect(() => {
        if (status === "done") {
            const filteredData = customers.filter(user => user.username.toLowerCase().includes(searchuser));

            const userlisted = filteredData.map((customer, index) => (
                <div key={index} className="card mb-3">
                    <div className="card-body">
                        <img src={`${TargetServer}${customer.img}`} width={"50px"} height={"50px"} style={{ borderRadius: "15px" }} alt='User Avatar'></img>
                        <h5 className="card-title">{customer.id} - {customer.username}</h5>
                        <p className="card-text">{customer.email}</p>
                        <p className="card-text">{customer.firstname || "John"} {customer.lastname || "Doe"}</p>
                        <button className="btn btn-primary" onClick={() => editUser(customer.id)}>Edit{" "}<FontAwesomeIcon icon={faEdit} /></button>{" "}
                        <button className="btn btn-danger" onClick={() => deleteUser(customer)}>Delete{" "}<FontAwesomeIcon icon={faRemove} /></button>{" "}
                        <button className="btn btn-success" onClick={() => userReceipts(customer.id)}>Receipts{" "}<FontAwesomeIcon icon={faReceipt} /></button>{" "}
                    </div>
                </div>

            ));
            setuserList(userlisted)
        } else {
            const loadtext = <div key="loading">Loading Status: {status}</div>;
            setuserList([loadtext]);
        }
    }, [customers, searchuser, status, editUser, GetUser, deleteUser])


    return (
        <div>
            <div className="container">
                <center>
                    <div className="col-md-5">
                        <div className="input-group mb-3">
                            <input type="text" onChange={(e) => setsearchuser(e.target.value.toLowerCase())} className="searchInput form-control" placeholder="Search..." />
                        </div>
                    </div>
                </center>
                <div className="container mt-4">
                    {userList}
                </div>
            </div>

            <Modal id="edituserModal" show={showmodal === Modals.edituser} onHide={() => setshowmodal(Modals.hide)}>
                <Modal.Header>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-group">
                        {editList}
                    </ul>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setshowmodal(Modals.hide)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>

            <Modal id="deleteuserModal" show={showmodal === Modals.deleteuser} onHide={() => setshowmodal(Modals.hide)}>
                <Modal.Header>
                    <Modal.Title>{deletetitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteBody}
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setshowmodal(Modals.hide)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Customers