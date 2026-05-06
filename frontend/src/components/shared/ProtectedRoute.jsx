import React from 'react';
import { Navigate } from 'react-router-dom';
import Error404 from '../../pages/public/Error404';

const ProtectedRoute = ({ children, allowedRole }) => {
    const userRole = localStorage.getItem('rol');
    const userSession = localStorage.getItem('usuario');

    if (!userSession || !userRole) {
        return <Error404 />;
    }

    if (userRole !== allowedRole) {
        return <Error404 />;
    }

    return children;
};

export default ProtectedRoute;
