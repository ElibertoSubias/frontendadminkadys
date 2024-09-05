import {
    EMPLEADOS,
    AGREGAR_EMPLEADO,
    LIMPIAR_EMPLEADOCREADO,
    MOSTRAR_ERROR,
    LIMPIAR_ERRORES,
    VALIDAR_EMPLEADO,
    ELIMINAR_EMPLEADO,
    EMPLEADO_ACTUAL,
    ACTUALIZAR_EMPLEADO,
    LIMPIAR_EMPLEADO,
    OBTENER_EMPLEADO
} from '../../types';

export default (state, action) => {
    switch(action.type) {
        case EMPLEADOS:
            return {
                ...state,
                empleados: action.payload
            }
        case AGREGAR_EMPLEADO:
            return {
                ...state,
                empleados: [action.payload, ...state.empleados],
                empleadocreado: action.payload
            }
        case LIMPIAR_EMPLEADOCREADO:
            return {
                ...state,
                empleadocreado: null
            }
        case OBTENER_EMPLEADO:
            return {
                ...state,
                empleadoseleccionado: action.payload
            }
        case MOSTRAR_ERROR:
            return {
                ...state,
                campoerror: action.payload
            }
        case LIMPIAR_ERRORES:
            return {
                ...state,
                campoerror: null
            }
        case VALIDAR_EMPLEADO:
            return {
                ...state,
                errorempleado: true
            }
        case ELIMINAR_EMPLEADO:
            return {
                ...state,
                empleados: state.empleados.filter(empleado => empleado._id !== action.payload)
            }
        case ACTUALIZAR_EMPLEADO:
            return {
                ...state,
                empleados: state.empleados.map(empleado => empleado._id === action.payload._id ? action.payload : empleado)
            }
        case EMPLEADO_ACTUAL:
            return {
                ...state,
                empleadoseleccionado: action.payload
            }
        case LIMPIAR_EMPLEADO:
            return {
                ...state,
                empleadoseleccionado: null
            }
        default:
            return state;
    }
}
