import React, { useReducer } from 'react';
import EmpleadoContext from './empleadoContext';
import EmpleadoReducer from './empleadoReducer';
// import {v4 as uuid} from 'uuid';
import clienteAxios from '../../config/axios';

import {
    EMPLEADOS,
    AGREGAR_EMPLEADO,
    LIMPIAR_EMPLEADOCREADO,
    OBTENER_EMPLEADO,
    MOSTRAR_ERROR,
    LIMPIAR_ERRORES,
    VALIDAR_EMPLEADO,
    ELIMINAR_EMPLEADO,
    EMPLEADO_ACTUAL,
    ACTUALIZAR_EMPLEADO,
    LIMPIAR_EMPLEADO
} from '../../types';

const EmpleadoState = props => {
    const initialState = {
        empleados: [],
        empleadocreado: null,
        errorempleado: false,
        campoerror: null,
        empleadoseleccionado: null
    }

    // Crear dispatch y state
    const [state, dispath] = useReducer(EmpleadoReducer, initialState);

    // Crear las funciones

    // Obtener empleado por numEmpleado
    const obtenerEmpleado = async empleado => {

        try {

            if (empleado && empleado.numEmpleado) {

                const resultado = await clienteAxios.get(`/api/empleados/${empleado.numEmpleado}`);

                dispath({
                    type: OBTENER_EMPLEADO,
                    payload: resultado.data.empleadoExistente
                });

            }

        } catch (error) {
            console.log(error);
        }

    }

    // Obtener todos los empleados
    const obtenerEmpleados = async () => {

        try {

            const token = localStorage.getItem('token');

            if (token) {

                const resultado = await clienteAxios.get(`/api/empleados`);

                dispath({
                    type: EMPLEADOS,
                    payload: resultado.data.empleados
                });

            }

        } catch (error) {
            console.log(error);
        }

    }

    // Agregar un empleado
    const agregarEmpleado = async empleado => {

        try {

            const respuesta = await clienteAxios.post('/api/empleados', empleado);

            dispath({
                type: AGREGAR_EMPLEADO,
                payload: respuesta.data.empleado
            });

            dispath({
                type: LIMPIAR_ERRORES,
                payload: respuesta.data.empleado
            });

            return true;

        } catch (error) {

            dispath({
                type: MOSTRAR_ERROR,
                payload: error.response.data.errores
            });

            return false;

        }

    }

    const limpiarEmpleadoCreado = () => {
        dispath({
            type: LIMPIAR_EMPLEADOCREADO
        });
    }

    const limpiarErrores = () => {
        dispath({
            type: LIMPIAR_ERRORES
        });
    }

    // Valida y muestra un error en caso de que sea necesario
    const validarEmpleado = (id) => {
        dispath({
            type: VALIDAR_EMPLEADO,
            payload: id
        })
    }

    // Eliminar empleado por id
    const eliminarEmpleado = async (id) => {

        try {

            await clienteAxios.delete(`/api/empleados/${id}`);

            dispath({
                type: ELIMINAR_EMPLEADO,
                payload: id
            })

            return true;

        } catch (error) {
            console.log(error);
            return false;
        }

    }

    // Editar o modificar un empleado
    const actualizarEmpleado = async empleado => {

        try {

            const resultado = await clienteAxios.put(`/api/empleados/${empleado._id}`, empleado);

            dispath({
                type: ACTUALIZAR_EMPLEADO,
                payload: resultado.data.empleado
            });

            return true;

        } catch (error) {
            console.log(error);
            return false;
        }

    }

    // Extraer un empleado para edición
    const guardarEmpleadoActual = empleado => {
        dispath({
            type: EMPLEADO_ACTUAL,
            payload: empleado
        })
    }

    // Eliminar el empleado seleccionado
    const limpiarEmpleado = () => {
        dispath({
            type: LIMPIAR_EMPLEADO
        })
    }

    return (
        <EmpleadoContext.Provider
            value={{
                empleados: state.empleados,
                empleadocreado: state.empleadocreado,
                errorempleado: state.errorempleado,
                campoerror: state.campoerror,
                empleadoseleccionado: state.empleadoseleccionado,
                obtenerEmpleado,
                obtenerEmpleados,
                agregarEmpleado,
                limpiarEmpleadoCreado,
                limpiarErrores,
                validarEmpleado,
                eliminarEmpleado,
                guardarEmpleadoActual,
                actualizarEmpleado,
                limpiarEmpleado
            }}
        >
            {props.children}
        </EmpleadoContext.Provider>
    )
}

export default EmpleadoState;
