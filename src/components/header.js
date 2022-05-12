import { Link, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import App from '../App';

function Header(){


    return (
        <div className="header-top">
        <nav className="navbar">
            <div className="brand">
                <a href='/'>
                <h1 className="brand-name">Artistic photos</h1>
                </a>
            </div>

            {/* <div className="link">
                        <p>Signin</p>
                        <p>Login</p>
            </div> */}
        </nav>
    </div>
    );
}

export default Header;
