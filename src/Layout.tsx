// Layout.js
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { is_user_logged, user_logout, is_user_staff, get_user_details } from './features/login/loginSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { TargetServer } from './features/settings/settings';


const Layout = () => {
    const logged = useAppSelector(is_user_logged);
    const myDetails = useAppSelector(get_user_details);
    const isstaff = useAppSelector(is_user_staff);
    const location = useLocation();
    const dispatch = useAppDispatch();

    const routeHeaders: Record<string, string> = {
        '/': 'Home',
        '/super': 'Products',
        '/contact': 'Contact',
        '/login': 'Login',
        '/profile': 'My Profile',
        '/admin': 'Admin Home',
        '/customers': 'Customers',
        '/allproducts': 'All Products',
        '/receipts': 'Show Receipts',
        // Add more routes and headers as needed
    };

    const headerText = routeHeaders[location.pathname] || '';

    // if(logged){
    //     userpicture.innerHTML = `<img src="${TargetServer}/static/images/${myDetails.img}" alt="Profile Logo" class="navbar-brand img-fluid" height = "40px" width="40px" style="border-radius: 50px;">`
    //     userpicture.style.display = "block";
    // }

    return (
        <div>
            <header className="bg-dark text-white">
                {logged ? <img src={`${TargetServer}/static/images/${myDetails.img || "placeholder.png"}`} alt = "Profile Logo" className="navbar-brand img-fluid" height = "40px" width="40px" style = {{borderRadius: "50px"}}/> : <></>}
                
                <div className="container">
                    <h1>{headerText}</h1>
                    <nav>
                        <ul className="nav">
                            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                                <NavLink to="/" className="nav-link">
                                    Home
                                </NavLink>
                            </li>
                            <li className={`nav-item ${location.pathname === '/super' ? 'active' : ''}`}>
                                <NavLink to="/super" className="nav-link">
                                    Products
                                </NavLink>
                            </li>
                            <li className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>
                                <NavLink to="/contact" className="nav-link">
                                    Contact
                                </NavLink>
                            </li>
                            {!logged ? (
                                <li className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
                                    <NavLink to="/login" className="nav-link">
                                        Login
                                    </NavLink>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <span className="nav-link" onClick={() => { dispatch(user_logout()) }} style={{ cursor: "pointer", color: "#007bff" }} >Logout</span>
                                    </li>
                                    <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                                        <NavLink to="/profile" className="nav-link">
                                            My Profile
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            {isstaff ? (
                                <>
                                    <li className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
                                        <NavLink to="/admin" className="nav-link">
                                            Admin Home
                                        </NavLink>
                                    </li>
                                    <li className={`nav-item ${location.pathname === '/customers' ? 'active' : ''}`}>
                                        <NavLink to="/customers" className="nav-link">
                                            Customers
                                        </NavLink>
                                    </li>
                                    <li className={`nav-item ${location.pathname === '/allproducts' ? 'active' : ''}`}>
                                        <NavLink to="/allproducts" className="nav-link">
                                            All Products
                                        </NavLink>
                                    </li>
                                    <li className={`nav-item ${location.pathname === '/receipts' ? 'active' : ''}`}>
                                        <NavLink to="/receipts" className="nav-link">
                                            Show Receipts
                                        </NavLink>
                                    </li>
                                </>
                            ) : ""}
                        </ul>
                    </nav>
                </div>
            </header>


            <Outlet />
        </div>
    );
};

export default Layout;
