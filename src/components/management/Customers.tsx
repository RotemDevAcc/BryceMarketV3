import React, { useState } from 'react'

const Customers = () => {
    const [input, setinput] = useState('')
    return (
        <div>
            <div className="container">
                <center>
                    <div className="col-md-5">
                        <div className="input-group mb-3">
                            <input type="text" onChange={(e)=>setinput(e.target.value)} className="searchInput form-control" placeholder="Search..."/>
                        </div>
                    </div>
                </center>
                <div className="container mt-4" /*id="userList"*/>
                    
                </div>
            </div>
        </div>
    )
}

export default Customers