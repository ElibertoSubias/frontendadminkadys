import React, { Fragment, useState, useContext, useEffect } from 'react';
import ProyectoContext from '../../context/proyectos/proyectoContext';

export default function MenuProyecto() {

    // Obtener el Sate del formulario
    const proyectosContext = useContext(ProyectoContext);
    const { formulario, formulariomovimientos, errorformulario, mostrarFormulario, mostrarFormularioMovimientos, agregarProyecto, mostrarError} = proyectosContext;

    const [proyecto, guardarProyecto] = useState({
        nombre: ''
    });

    const {nombre} = proyecto;

    // Leer los contenidos del input
    const onChangeOpcion = e => {
        guardarProyecto({
            ...proyecto,
            [e.target.name] : e.target.value
        })
    }

    const onClickFormulario = () => {
        mostrarFormulario();
    }

    const onClickFormularioMovimientos = () => {
        mostrarFormularioMovimientos();
    }

    return (
        <Fragment>
            <button
                type="button"
                className="btn btn-block btn-primario"
                onClick={onClickFormulario}
            >
            Empleados</button>

            <button
                type="button"
                className="btn btn-block btn-primario"
                onClick={onClickFormularioMovimientos}
            >
            Capturar Nomina</button>

        </Fragment>
    );
}
