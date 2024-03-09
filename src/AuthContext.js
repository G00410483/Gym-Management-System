// File is crucial part of managing authentication state accross Reacth application 
// Ensures that components can remain 'clean' and focuesd on their primary responsabilities
// Reference: https://dayvster.com/blog/use-context-for-auth/

// Import necessary hooks and functions from React to create and use contexts, and to manage state within our context.
import React, { createContext, useContext, useState } from 'react';

// Create context object that will provide the authentication state accross the application
const AuthContext = createContext();

// Custom hook that allows easy consumption of our AuthContext in any component.
export function useAuth() {
    return useContext(AuthContext);
}

// Component that will provide the authentication state to any of its child components
export const AuthProvider = ({ children }) => {
    // State hook to manage login status
    // Initializes with a check on the local storage to see if a token exists, implying the user is logged in.
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    // Function to handle login
    // It receives a token, saves it to local storage, and updates the login status state.
    const login = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };
    // Function to handle logout
    // It removes the token from local storage and updates the login status state.
    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    // The value that will be provided to any consumers of the AuthContext
    // It includes the login state and the login/logout functions.
    const value = {
        isLoggedIn,
        login,
        logout,
    };

    // The AuthProvider component renders a provider for the AuthContext,
    // passing the value object to be available to all descendant components.
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
