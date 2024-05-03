// SidebarMenu.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Zaimportuj hook useAuth
import './css/Sidebarmenu.css';
import '@fortawesome/fontawesome-free/css/all.css';

function SidebarMenu() {
    const { currentUser, logout } = useAuth();

    return (
        <div className="sidebar">
            <ul className="menu-list">
                {/* Opcje dostępne dla wszystkich użytkowników */}
                <li className="menu-item"><Link to="/home"><i className="fas fa-home"></i>Home</Link></li>
                <li className="menu-item"><Link to="/event"><i className="fas fa-calendar-alt"></i>Wydarzenia</Link></li>

                {/* Opcje dostępne tylko dla zalogowanych użytkowników */}
                {currentUser ? (
                    <>
                        <li className="menu-item"><Link to="/profile"><i className="fas fa-id-badge"></i>Profil</Link></li>
                        <li className="menu-item">
                            <button onClick={logout} className="w-full text-left">
                                <i className="fas fa-sign-out-alt"></i>Wyloguj
                            </button>
                        </li>
                    </>
                ) : (
                    <li className="menu-item"><Link to="/login"><i className="fas fa-sign-in-alt"></i>Logowanie</Link></li>
                )}
            </ul>
        </div>
    );
}

export default SidebarMenu;
