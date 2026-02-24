import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        delete API.defaults.headers.common['x-auth-token'];
        setUser(null);
    }, []);

    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        API.defaults.headers.common['x-auth-token'] = token;
        setUser(userData);
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            console.log('AuthProvider: Loading user from storage...');
            const token = localStorage.getItem('token');
            if (token) {
                console.log('AuthProvider: Token found, fetching user profile...');
                API.defaults.headers.common['x-auth-token'] = token;
                try {
                    const res = await API.get('/api/auth/me');
                    console.log('AuthProvider: User profile loaded:', res.data);
                    if (res.data) {
                        setUser(res.data);
                    } else {
                        throw new Error('No user data received');
                    }
                } catch (err) {
                    console.error('AuthProvider: Failed to load user session:', err);
                    logout();
                }
            } else {
                console.log('AuthProvider: No token found.');
            }
            setLoading(false);
        };

        loadUser();

        // Global 401 Interceptor
        const interceptor = API.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => API.interceptors.response.eject(interceptor);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
