import React, { useContext, useEffect } from 'react';
import { Route, redirect, Navigate } from 'react-router-dom';
import AuthContext from '../../context/autenticacion/authContext';

export default function RutaPrivada({ children }) {

    const authContext = useContext(AuthContext);
    const { autenticado, cargando, usuarioAutenticado } = authContext;

    useEffect(() => {
        usuarioAutenticado();
        // eslint-disable-next-line
    },[]);

    return autenticado ? children : <Navigate to="/" />;
}
