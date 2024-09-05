import React, { useReducer } from 'react';
import MovimientoContext from './movimientoContext';
import MovimientoReducer from './movimientoReducer';
// import {v4 as uuid} from 'uuid';
import clienteAxios from '../../config/axios';

import {
    MOVIMIENTOS_PROYECTO,
    AGREGAR_MOVIMIENTO,
    VALIDAR_MOVIMIENTO,
    ELIMINAR_MOVIMIENTO,
    MOVIMIENTO_ACTUAL,
    ACTUALIZAR_MOVIMIENTO,
    LIMPIAR_MOVIMIENTO
} from '../../types';

const MovimientoState = props => {
    const initialState = {
        movimientosproyecto: [],
        errormovimientos: false,
        movimientoseleccionado: null
    }

    // Crear dispatch y state
    const [state, dispath] = useReducer(MovimientoReducer, initialState);

    // Crear las funciones

    // Obtener los movimientos
    const obtenerMovimientos = async proyecto => {
        // console.log(proyecto);
        try {

            if (proyecto) {

                const resultado = await clienteAxios.get('/api/movimientos', { params: {proyecto}});
                // console.log(resultado);
                dispath({
                    type: MOVIMIENTOS_PROYECTO,
                    payload: resultado.data.movimientos
                });

            }

        } catch (error) {
            console.log(error);
        }

    }

    // Agregar un movimiento
    const agregarMovimiento = async movimiento => {

        try {

            const respuesta = await clienteAxios.post('/api/movimientos', movimiento);

            dispath({
                type: AGREGAR_MOVIMIENTO,
                payload: respuesta.data.movimiento
            });

        } catch (error) {
            console.log(error);
        }

    }

    // Valida y muestra un error en caso de que sea necesario
    const validarMovimiento = () => {
        dispath({
            type: VALIDAR_MOVIMIENTO
        })
    }

    // Eliminar movimiento por id
    const eliminarMovimiento = async (id, proyecto) => {

        try {

            await clienteAxios.delete(`/api/movimientos/${id}`, { params: { proyecto }});

            dispath({
                type: ELIMINAR_MOVIMIENTO,
                payload: id
            })

        } catch (error) {
            console.log(error);
        }

    }

    // Editar o modificar un movimiento
    const actualizarMovimiento = async movimiento => {

        try {

            const resultado = await clienteAxios.put(`/api/movimientos/${movimiento._id}`, movimiento);
            // console.log(resultado.data.movimiento);

            dispath({
                type: ACTUALIZAR_MOVIMIENTO,
                payload: resultado.data.movimiento
            })

        } catch (error) {
            console.log(error);
        }

    }

    // Extraer un movimiento para edición
    const guardarMovimientoActual = movimiento => {
        dispath({
            type: MOVIMIENTO_ACTUAL,
            payload: movimiento
        })
    }

    // Eliminar movimiento seleccionado
    const limpiarMovimiento = () => {
        dispath({
            type: LIMPIAR_MOVIMIENTO
        })
    }

    return (
        <MovimientoContext.Provider
            value={{
                movimientosproyecto: state.movimientosproyecto,
                errormovimiento: state.errormovimiento,
                movimientoeleccionado: state.movimientoeleccionado,
                obtenerMovimientos,
                agregarMovimiento,
                validarMovimiento,
                eliminarMovimiento,
                guardarMovimientoActual,
                actualizarMovimiento,
                limpiarMovimiento
            }}
        >
            {props.children}
        </MovimientoContext.Provider>
    )
}

export default MovimientoState;
