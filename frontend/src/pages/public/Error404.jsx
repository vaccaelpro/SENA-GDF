import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Error404.css';

const Error404 = () => {
    return (
        <div className="error404-container">
            <div className="error404-content">
                <div className="error404-icon">
                    <ion-icon name="alert-circle-outline"></ion-icon>
                </div>
                <h1 className="error404-title">404</h1>
                <h2 className="error404-subtitle">¡Ups! Acceso Restringido</h2>
                <p className="error404-text">
                    La página que buscas no existe o no tienes los permisos necesarios para acceder a ella.
                </p>
                <Link to="/" className="btn-back">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default Error404;
