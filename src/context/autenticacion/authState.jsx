import React, { useReducer } from 'react';
import AuthContext from './authContext'
import AuthReducer from './authReducer';
import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/tokenAuth';

import {
    REGISTRO_EXITOSO,
    REGISTRO_ERROR,
    OBTENER_USUARIO,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    CERRAR_SESION
 } from '../../types';

 const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        autenticado: null,
        usuario: null,
        mensaje: null,
        cargando: true
    }

    const [ state, dispath ] = useReducer(AuthReducer, initialState);

    const registrarUsuario = async datos => {

        try {

            const respuesta = await clienteAxios.post('/api/usuarios', datos);
            // console.log(respuesta.data);
            dispath({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data
            });

            // Obtener el usuario
            usuarioAutenticado();

        } catch (error) {
            // console.log(error.response.data.msg);
            const alerta = {
                msg: error.response.data.msg,
                categoria: 'alerta-error'
            }
            dispath({
                type: REGISTRO_ERROR,
                payload: alerta
            })
        }

    }

    // Retorna el usuario autenticado
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Funcion para enviar el token por headers
            if (token) {
                tokenAuth(token);
            }

            try {
                const respuesta = await clienteAxios.get('/api/auth');
                dispath({
                    type: OBTENER_USUARIO,
                    payload: respuesta.data.empleado
                })
            } catch (error) {
                // console.log(error.response);
                dispath({
                    type: LOGIN_ERROR
                })
            }
        }
    }

    // Cuando el usuario inicia sesión
    const iniciarSesion = async datos => {

        try {

            const respuesta = await clienteAxios.post('/api/auth', datos);

            dispath({
                type: LOGIN_EXITOSO,
                payload: respuesta.data
            });

            // Obtener el usuario
            usuarioAutenticado();

        } catch (error) {
            // console.log(error.response.data.msg);
            const alerta = {
                msg: error.response.data.msg,
                categoria: 'alerta-error'
            }
            dispath({
                type: LOGIN_ERROR,
                payload: alerta
            })
        }

    }

    // Cerrar la sesión del usuario
    const cerrarSesion = () => {
        dispath({
            type: CERRAR_SESION
        })
    }

    return(
        <AuthContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                cargando: state.cargando,
                registrarUsuario,
                iniciarSesion,
                usuarioAutenticado,
                cerrarSesion
            }}
        >{props.children}

        </AuthContext.Provider>
    )
 }
 export default AuthState;
