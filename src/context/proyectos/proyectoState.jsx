import React, { useReducer } from 'react';
// import {v4 as uuid} from 'uuid';

import proyectoContext from './proyectoContext';
import proyectoReducer from './proyectoReducer';
import {
    FORMULARIO_PROYECTO,
    FORMULARIO_MOVIMIENTOS,
    OBTENER_PROYECTO,
    AGREGAR_PROYECTO,
    PROYECTO_ERROR,
    VALIDAR_FORMULARIO,
    PROYECTO_ACTUAL,
    ELIMINAR_PROYECTO,
    OBTENER_CONFIGURACION,
    EMPLEADOS

} from '../../types';
import tokenAuth from '../../config/tokenAuth';

import clienteAxios from '../../config/axios';

const ProyectoState = props => {

    const initialState = {
        proyectos : [],
        formulario: true,
        formulariomovimientos: false,
        errorformulario: false,
        proyecto: null,
        mensaje: null,
        sueldobase: null
    }

    // Dispath para ejecutar las acciones
    const [state, dispath] = useReducer(proyectoReducer, initialState);

    // Serie de funciones para el CRUD
    const mostrarFormulario = () => {
        dispath({
            type: FORMULARIO_PROYECTO
        })
    }

    const mostrarFormularioMovimientos = () => {
        dispath({
            type: FORMULARIO_MOVIMIENTOS
        })
    }

    // Obtener los proyectos
    const obtenerProyectos = async () => {

        const token = localStorage.getItem('token');

        if (token) {

            try {

                tokenAuth(token);

                const resultado = await clienteAxios.get('/api/proyectos');
                dispath({
                    type: OBTENER_PROYECTO,
                    payload: resultado.data.proyectos
                })

            } catch (error) {
                console.log(error);
                const alerta = {
                    msg: 'Hubo un error',
                    categoria: 'alerta-error'
                }

                dispath({
                    type: PROYECTO_ERROR,
                    payload: alerta
                })

            }
        }

    }

    // Obtener configuracion
    const obtenerConfiguracion = async id => {

        const token = localStorage.getItem('token');

        if (token) {

            try {

                tokenAuth(token);

                const resultado = await clienteAxios.get(`/api/configuracion/${id}`);

                dispath({
                    type: OBTENER_CONFIGURACION,
                    payload: resultado.data.configuracion
                })

            } catch (error) {
                console.log(error);
                const alerta = {
                    msg: 'Hubo un error',
                    categoria: 'alerta-error'
                }

                dispath({
                    type: PROYECTO_ERROR,
                    payload: alerta
                })

            }
        }

    }

    const grabarNomina = async (nomina) => {
        try {
            const resultado = await clienteAxios.post(`/api/nominas`, nomina);
        } catch (error) {
            console.log(error);
        }
    }

    // Validar el formulario por errores
    const mostrarError = () => {
        dispath({
            type: VALIDAR_FORMULARIO
        })
    }

    // Selecciona el Proyecto que el usuario dio click
    const proyectoActual = proyectoId => {
        dispath({
            type: PROYECTO_ACTUAL,
            payload: proyectoId
        })
    }

    // Eliminar un proyecto
    const eliminarProyecto = async proyectoId => {
        try {

            await clienteAxios.delete(`/api/proyectos/${proyectoId}`);

            dispath({
                type: ELIMINAR_PROYECTO,
                payload: proyectoId
            });

        } catch (error) {

            const alerta = {
                msg: 'Hubo un error',
                categoria: 'alerta-error'
            }

            dispath({
                type: PROYECTO_ERROR,
                payload: alerta
            })

        }
    }

    return (
        <proyectoContext.Provider
            value={{
                proyectos: state.proyectos,
                sueldobase: state.sueldobase,
                formulario: state.formulario,
                formulariomovimientos: state.formulariomovimientos,
                errorformulario: state.errorformulario,
                proyecto: state.proyecto,
                mensaje: state.mensaje,
                mostrarFormulario,
                obtenerConfiguracion,
                mostrarFormularioMovimientos,
                obtenerProyectos,
                grabarNomina,
                mostrarError,
                proyectoActual,
                eliminarProyecto
            }}
        >
            {props.children}
        </proyectoContext.Provider>
    )
}

export default ProyectoState;
