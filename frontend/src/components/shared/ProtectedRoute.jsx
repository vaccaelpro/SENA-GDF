import React from 'react';
import { Navigate } from 'react-router-dom';
import Error404 from '../../pages/public/Error404';

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('rol');
    const userSession = localStorage.getItem('usuario');

    // Si no hay sesión válida (faltan datos o token inválido) → al login
    const hasValidSession = token && token !== 'undefined' && token !== 'null'
        && userSession && userSession !== 'undefined'
        && userRole;

    if (!hasValidSession) {
        return <Navigate to="/" replace />;
    }

    // Si hay sesión pero el rol no coincide → 404
    if (userRole !== allowedRole) {
        return <Error404 />;
    }

    return children;
};

export default ProtectedRoute;
