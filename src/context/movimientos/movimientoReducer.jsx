import {
    EMPLEADOS_PROYECTO,
    AGREGAR_EMPLEADO,
    VALIDAR_EMPLEADO,
    ELIMINAR_EMPLEADO,
    EMPLEADO_ACTUAL,
    ACTUALIZAR_EMPLEADO,
    LIMPIAR_EMPLEADO
} from '../../types';

export default (state, action) => {
    switch(action.type) {
        case EMPLEADOS_PROYECTO:
            return {
                ...state,
                empleadosproyecto: action.payload
            }
        case AGREGAR_EMPLEADOS:
            return {
                ...state,
                empleadosproyecto: [action.payload, ...state.empleadosproyecto]
            }
        case VALIDAR_EMPLEADO:
            return {
                ...state,
                errorempleado: true
            }
        case ELIMINAR_EMPLEADO:
            return {
                ...state,
                empleadosproyecto: state.empleadosproyecto.filter(empleado => empleado._id !== action.payload)
            }
        case ACTUALIZAR_EMPLEADO:
            return {
                ...state,
                empleadosproyecto: state.empleadosproyecto.map(empleado => empleado._id === action.payload._id ? action.payload : empleado)
            }
        case EMPLEADO_ACTUAL:
            return {
                ...state,
                empleadoseleccionado: action.payload
            }
        case LIMPIAR_TAREA:
            return {
                ...state,
                empleadoseleccionado: null
            }
        default:
            return state;
    }
}
