// Layout.js
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { is_user_logged, user_logout, is_user_staff } from './features/login/loginSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';


const Layout = () => {
    const logged = useAppSelector(is_user_logged);
    const isstaff = useAppSelector(is_user_staff);
    const location = useLocation();
    const dispatch = useAppDispatch();

    return (
        <div>
            <header className="bg-dark text-white">
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
                        ):""}
                    </ul>
                </nav>
            </header>

            <Outlet />
        </div>
    );
};

export default Layout;
