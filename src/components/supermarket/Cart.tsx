import React, { useState } from 'react'
import { clearCart, removeProduct, selectCart, selectPrice } from './cartSlice'
import { Modal, Button } from 'react-bootstrap';
import { get_user_token } from '../login/loginSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom, faCashRegister, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { purchaseCartAsync } from './superSlice';
import Paypal from './Paypal';

const Cart = () => {
    const myCart = useAppSelector(selectCart)
    const token = useAppSelector(get_user_token);
    const totalPrice = useAppSelector(selectPrice)
    const dispatch = useAppDispatch();
    const [showModal, setShowModal] = useState(false);
    const [modalmessage, setModalMessage] = useState("")
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const show_dialog = async () => {
        const confirmationMessage = `Are you sure you want to purchase all the items for $${totalPrice}?`;
        setModalMessage(confirmationMessage);
        handleShow();
    };

    const handleConfirm = () => {
        handleClose();

        dispatch(purchaseCartAsync({cart:myCart,price:totalPrice,token}));
    };

    const handleCancel = () => {
        handleClose();
    };
    return (
        <div>
            <div className="card">
                <div className="card-header">
                    Shopping Cart{' '}
                    <FontAwesomeIcon icon={faShoppingCart}/>
                </div>
                <ul className="list-group list-group-flush" id="cart-items">
                    {myCart.map((prod, index) => (
                        <li key={index} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{prod.name} (Count: {prod.count}) - {(prod.price * prod.count).toFixed(2)}</span>
                                <button className="btn btn-sm btn-danger" onClick={() => dispatch(removeProduct({ prodid: prod.id }))}>X</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="card-body">
                    <h5>${totalPrice}</h5>
                    {/* <div className="card-header"> */}


                    {/* </div> */}
                    <button className="btn btn-primary" onClick={() => show_dialog()} style={{ margin: 5 }}>
                        Checkout{' '}
                        <FontAwesomeIcon icon={faCashRegister} />
                    </button>
                    
                    <button className="btn btn-danger" onClick={() => dispatch(clearCart())}>
                        Clear Cart{' '}
                        <FontAwesomeIcon icon={faBroom} />
                    </button>


                </div>
            </div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalmessage}</Modal.Body>
                <Modal.Footer>
                    {totalPrice > 0.0 ? <Paypal price={totalPrice}></Paypal> : <>No Products Selected</>}
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    {/* <Button variant="primary" onClick={handleConfirm}>
                        Confirm
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Cart