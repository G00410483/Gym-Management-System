import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role') || '');

    const login = (token, userRole) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole); 
        setIsLoggedIn(true);
        setRole(userRole); 
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setRole('');
    };

    const isRole = (expectedRole) => role === expectedRole;

    const value = {
        isLoggedIn,
        role,
        login,
        logout,
        isRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
