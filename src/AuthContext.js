import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [email, setEmail] = useState(localStorage.getItem('email') || '');

    const login = (token, userRole, userEmail) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole); 
        localStorage.setItem('email', userEmail);
        setIsLoggedIn(true);
        setRole(userRole); 
        setEmail(userEmail);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        setIsLoggedIn(false);
        setRole('');
        setEmail('');
    };

    const isRole = (expectedRole) => role === expectedRole;

    const value = {
        isLoggedIn,
        role,
        login,
        logout,
        isRole,
        email
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

