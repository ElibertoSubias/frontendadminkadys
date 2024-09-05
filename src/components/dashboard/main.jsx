import React, { useContext, useEffect } from 'react';
import Sidebar from '../layout/Sidebar';
import Barra from '../layout/Barra';
import FormEmpleados from '../empleados/FormEmpleados';
import ProyectoContext from '../../context/proyectos/proyectoContext';
import AuthContext from '../../context/autenticacion/authContext';
import ListadoMovimientos from '../movimientos/ListadoMovimientos';
import empleadoContext from '../../context/empleados/empleadoContext';

export default function Main () {

    const authContext = useContext(AuthContext);
    const { usuarioAutenticado, usuario } = authContext;

    // Obtener la funcion del context de empleado
    const empleadosContext = useContext(empleadoContext);
    const { obtenerEmpleados } = empleadosContext;

    // Obtener el Sate de proyectos
    const proyectosContext = useContext(ProyectoContext);
    const { formulariomovimientos, formulario, obtenerConfiguracion } = proyectosContext;

    useEffect(() => {
        usuarioAutenticado();
        obtenerConfiguracion(101);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (usuario) {
            obtenerEmpleados();
        }
    }, [usuario]);

    return (
        <div className="contenedor-app">
            <Sidebar/>
            <div className="seccion-principal">
                <Barra/>
                <main className="main-body">
                    {formulario ? (
                        <FormEmpleados />
                    ): (
                        <ListadoMovimientos />
                    )}
                </main>
            </div>
        </div>
    );
}
