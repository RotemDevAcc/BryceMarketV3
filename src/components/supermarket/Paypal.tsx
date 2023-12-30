import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const Paypal = (props:{price:number}) => {

    const initialOptions = {
        clientId: "AUYRjtY2_vXsZMeIQWnqTM5JLYztUm3tqA_Wd-2Do5cHGISL-hKYAWg9Ua82DvEUbvIrvfHmjzBHdOlA",
        currency: "USD",
        intent: "capture",
    };

    const handleApprove = (orderid:string) => {
        // Call backend Function to fullfill order

        // if response is sucess
        // setPaidFor(true);
        console.log(orderid)
        console.log("Here")
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
                    const order = await actions.order.capture();
                    console.log("order",order)

                    handleApprove(data.orderID)
                }}
            />
            </PayPalScriptProvider>
        </div>
    )
}

export default Paypal