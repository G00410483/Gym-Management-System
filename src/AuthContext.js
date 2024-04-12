import React, { createContext, useContext, useState } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to access authentication context
export function useAuth() {
    return useContext(AuthContext);
}

// Authentication provider component
export const AuthProvider = ({ children }) => {
    // State variables for authentication status, role, and email
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [email, setEmail] = useState(localStorage.getItem('email') || '');

    // Function to handle user login
    const login = (token, userRole, userEmail) => {
        // Store authentication data in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole); 
        localStorage.setItem('email', userEmail);
        // Update state variables
        setIsLoggedIn(true);
        setRole(userRole); 
        setEmail(userEmail);
    };

    // Function to handle user logout
    const logout = () => {
        // Remove authentication data from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        // Update state variables
        setIsLoggedIn(false);
        setRole('');
        setEmail('');
    };

    // Function to check if the user has a specific role
    const isRole = (expectedRole) => role === expectedRole;

    // Combine authentication-related values into an object
    const value = {
        isLoggedIn,
        role,
        login,
        logout,
        isRole,
        email
    };

    // Provide the authentication context with the combined values to its children
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
