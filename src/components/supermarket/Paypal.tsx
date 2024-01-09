import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Message } from '../../Message';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { purchaseCartAsync, selectcoupon } from './superSlice';
import { selectCart, selectPrice } from './cartSlice';
import { get_user_token } from '../login/loginSlice';
const Paypal = (props:{price:number}) => {

    const dispatch = useAppDispatch()
    const myCart = useAppSelector(selectCart)
    const token = useAppSelector(get_user_token);
    const totalPrice = useAppSelector(selectPrice);
    const VerifiedCoupon = useAppSelector(selectcoupon);
    const initialOptions = {
        clientId: "AUYRjtY2_vXsZMeIQWnqTM5JLYztUm3tqA_Wd-2Do5cHGISL-hKYAWg9Ua82DvEUbvIrvfHmjzBHdOlA",
        currency: "USD",
        intent: "capture",
    };

    const handleApprove = (orderid:string) => {
        dispatch(purchaseCartAsync({cart:myCart,price:totalPrice,token,coupon:VerifiedCoupon, orderid:orderid}));
    }

    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons style={{ layout: "horizontal" }} 
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: "Product Payment",
                                amount: {
                                    value:props.price.toString()
                                },
                            }
                        ]
                    })
                }}
                onApprove={async (data,actions:any) => {
                    Message("Order Sent, Please Wait.","info")
                    const order = await actions.order.capture();
                    Message("Order Sent Successfully.","success")
                    console.log("order",order)

                    handleApprove(data.orderID)
                }}
            />
            </PayPalScriptProvider>
        </div>
    )
}

export default Paypal