import {
    FORMULARIO_PROYECTO,
    FORMULARIO_MOVIMIENTOS,
    OBTENER_PROYECTO,
    AGREGAR_PROYECTO,
    PROYECTO_ERROR,
    VALIDAR_FORMULARIO,
    PROYECTO_ACTUAL,
    ELIMINAR_PROYECTO,
    OBTENER_CONFIGURACION
} from '../../types';

export default (state, action) => {
    switch(action.type) {
        case FORMULARIO_PROYECTO:
            return {
                ...state,
                formulario: true,
                formulariomovimientos: false
            }
        case FORMULARIO_MOVIMIENTOS:
            return {
                ...state,
                formulario: false,
                formulariomovimientos: true
            }
        case OBTENER_PROYECTO:
            // console.log(action.payload);
            return {
                ...state,
                proyectos: action.payload
            }
        case AGREGAR_PROYECTO:
            return {
                ...state,
                proyectos: [...state.proyectos, action.payload],
                formulario: false,
                errorformulario: false
            }
        case VALIDAR_FORMULARIO:
            return {
                ...state,
                errorformulario: true
            }
        case PROYECTO_ACTUAL:
            return {
                ...state,
                proyecto: state.proyectos.filter(proyecto => proyecto._id === action.payload)
            }
        case ELIMINAR_PROYECTO:
            return {
                ...state,
                proyectos: state.proyectos.filter(proyecto => proyecto._id !== action.payload),
                proyecto: null
            }
        case PROYECTO_ERROR:
            return {
                ...state,
                mensaje: action.payload
            }
        case OBTENER_CONFIGURACION:
            return {
                ...state,
                sueldobase: action.payload
            }
        default:
            return state;
    }
}
