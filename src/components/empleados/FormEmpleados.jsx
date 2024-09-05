import React, { useContext, useState, useEffect } from 'react';
import ProyectoContext from '../../context/proyectos/proyectoContext';
import empleadoContext from '../../context/empleados/empleadoContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function FormEmpleados() {

    const MySwal = withReactContent(Swal)

    // Extraer si un proyecto esta activo
    const proyectosContext = useContext(ProyectoContext);
    const { proyecto } = proyectosContext;

    // Obtener la funcion del context de empleado
    const empleadosContext = useContext(empleadoContext);
    const { empleadoseleccionado, errorempleado, empleadocreado, limpiarErrores, campoerror, limpiarEmpleadoCreado, agregarEmpleado, validarEmpleado, obtenerEmpleado, actualizarEmpleado, limpiarEmpleado, eliminarEmpleado } = empleadosContext;

    useEffect(() => {
        limpiarEmpleado();
        limpiarErrores();
    },[]);

    // Effect que detecta si hay un empleado seleccionado
    useEffect(() => {
        if (empleadoseleccionado && empleadoseleccionado !== null) {
            const {
                _id,
                numEmpleado,
                nombre,
                apPaterno,
                apMaterno,
                tipoEmpleado,
                rolEmpleado
            } = empleadoseleccionado;
            guardarEmpleado({
                _id: _id ? _id : '',
                numEmpleado: numEmpleado ? numEmpleado : '',
                nombre: nombre ? nombre : '',
                apPaterno: apPaterno ? apPaterno : '',
                apMaterno: apMaterno ? apMaterno : '',
                tipoEmpleado: tipoEmpleado != '' ? tipoEmpleado : '0',
                rolEmpleado: rolEmpleado != '' ? rolEmpleado : '0'
            });
        } else {
            guardarEmpleado({
                numEmpleado: '',
                nombre: '',
                apPaterno: '',
                apMaterno: '',
                rolEmpleado: '0',
                tipoEmpleado: '0'
            });
        }
    }, [empleadoseleccionado]);

    // State del formulario
    const [empleado, guardarEmpleado] = useState({
        numEmpleado: '',
        nombre: '',
        apPaterno: '',
        apMaterno: '',
        rolEmpleado: '0',
        tipoEmpleado: '0'
    });

    // extraer el nombre del proyecto
    const { numEmpleado, nombre, apPaterno, apMaterno, rolEmpleado, tipoEmpleado } = empleado;

    // Si no hay proyecto seleccionado
    // if (!proyecto) return null

    // Array destructuring para extraer el proyecto actual
    // const [proyectoActual] = proyecto;

    // Leer los valores del formulario
    const handleChange = e => {
        if (e.target.name === "numEmpleado" && empleadoseleccionado) {
            guardarEmpleado({
                numEmpleado: '',
                nombre: '',
                apPaterno: '',
                apMaterno: '',
                rolEmpleado: '0',
                tipoEmpleado: '0'
            });
            limpiarEmpleado();
        } else {
            guardarEmpleado({
                ...empleado,
                [e.target.name]: e.target.value
            })
        }
    }

    useEffect(() => {
        // reiniciar el form
        if (!campoerror || campoerror.length === 0) {
            guardarEmpleado({
                numEmpleado: '',
                nombre: '',
                apPaterno: '',
                apMaterno: '',
                rolEmpleado: '0',
                tipoEmpleado: '0'
            });
        }
    }, [campoerror]);

    useEffect(() => {

        if (empleadocreado) {

            MySwal.fire({
                title: <p>Empleado creado con exito</p>,
            }).then(() => {
                guardarEmpleado({
                    numEmpleado: '',
                    nombre: '',
                    apPaterno: '',
                    apMaterno: '',
                    rolEmpleado: '0',
                    tipoEmpleado: '0'
                });
                return MySwal.fire(<p>Número de empleado: {empleadocreado.numEmpleado}</p>)
            });

            limpiarEmpleadoCreado();

        }

    }, [empleadocreado]);

    const buscarNumEmpleado = e => {
        if (e.key === 'Enter') {
            obtenerEmpleado(empleado);
        }
    }

    const eliminar = e => {
        e.preventDefault();
        if (empleadoseleccionado && empleadoseleccionado._id) {

            MySwal.fire({
                title: 'Eliminar el empleado ' + empleadoseleccionado.numEmpleado + '?',
                showDenyButton: true,
                confirmButtonText: 'Si',
                denyButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (eliminarEmpleado(empleadoseleccionado._id)) {
                        guardarEmpleado({
                            numEmpleado: '',
                            nombre: '',
                            apPaterno: '',
                            apMaterno: '',
                            rolEmpleado: '0',
                            tipoEmpleado: '0'
                        });
                        MySwal.fire({
                            title: <p>Empleado eliminado con exito</p>,
                        });
                        limpiarEmpleado();
                    } else {
                        MySwal.fire({
                            title: <p>Ops!, algo salio mal al eliminar el empleado</p>,
                        });
                    }
                }
            });

        }
    }

    const onSubmit = e => {
        e.preventDefault();
        //validar
        // if (nombre.trim() === '') {
        //     return;
        // }
        // if (apPaterno.trim() === '') {
        //     return;
        // }
        // if (apMaterno.trim() === '') {
        //     return;
        // }

        // Si es edicion o si es nuevo empleado
        if (empleadoseleccionado === null) {
            // agregar el nuevo empleado al state de empleados
            // empleado.proyecto = proyectoActual._id;
            agregarEmpleado(empleado);
        } else {
            // Actualizar empleado existente
            if (actualizarEmpleado(empleado)) {
                MySwal.fire({
                    title: <p>Empleado actualizado con exito</p>,
                });
            } else {
                MySwal.fire({
                    title: <p>Ops!, algo salio mal al actualizar</p>,
                });
            }
            limpiarEmpleado();

        }

        // Obtener y filtrar los empleados del proyecto actual
        // obtenerEmpleados(proyectoActual.id);

    }

    return (
        <div className="formulario">
            <div className="cont-form" style={{ marginBottom: "2rem" }}>
                <div className="contenedor-input">
                    <label htmlFor="numEmpleado">Buscar por Número empleado:</label>
                </div>
                <div className="contenedor-input">
                    <input
                        type="number"
                        className="input-text"
                        placeholder="Número empleado"
                        id="btnBuscarEmpleado"
                        name="numEmpleado"
                        value={numEmpleado}
                        onChange={handleChange}
                        onKeyDown={buscarNumEmpleado}
                    />
                </div>
            </div>
            <hr />
            <form
                onSubmit={onSubmit}
            >
                <div className="cont-form">
                    <div className="contenedor-input">
                        <label htmlFor="nombre">Nombre:</label>
                    </div>
                    <div className="contenedor-input">
                        <input
                            type="text"
                            className="input-text"
                            placeholder="Nombre empleado"
                            name="nombre"
                            value={nombre}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="apPaterno">Apellido Paterno:</label>
                    </div>
                    <div className="contenedor-input">
                        <input
                            type="text"
                            className="input-text"
                            placeholder="Apelllido Paterno"
                            name="apPaterno"
                            value={apPaterno}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="apMaterno">Apellido Materno:</label>
                    </div>
                    <div className="contenedor-input">
                        <input
                            type="text"
                            className="input-text"
                            placeholder="Apelllido Materno"
                            name="apMaterno"
                            value={apMaterno}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="contenedor-input" style={{ textAlign: "left", marginTop: "1rem" }}>
                        <fieldset className="w50">
                            <legend>Rol:</legend>
                            <div>
                                <input
                                    onChange={handleChange}
                                    type="radio"
                                    id="chofer"
                                    name="rolEmpleado"
                                    checked={rolEmpleado == 0}
                                    value="0"
                                />
                                <label htmlFor="chofer" className="activa-cursor">Chofer</label>
                            </div>
                            <div>
                                <input
                                    onChange={handleChange}
                                    type="radio"
                                    id="cargador"
                                    name="rolEmpleado"
                                    checked={rolEmpleado == 1}
                                    value="1"
                                />
                                <label htmlFor="cargador" className="activa-cursor">Cargador</label>
                            </div>
                            <div>
                                <input
                                    onChange={handleChange}
                                    type="radio"
                                    id="Auxiliar"
                                    name="rolEmpleado"
                                    checked={rolEmpleado == 2}
                                    value="2"
                                />
                                <label htmlFor="Auxiliar" className="activa-cursor">Auxiliar</label>
                            </div>
                        </fieldset>
                        <fieldset className="w50">
                            <legend>Tipo:</legend>
                            <div>
                                <input
                                    onChange={handleChange}
                                    type="radio"
                                    id="interno"
                                    name="tipoEmpleado"
                                    value="0"
                                    checked={tipoEmpleado == 0}
                                />
                                <label htmlFor="interno" className="activa-cursor">Interno</label>
                            </div>
                            <div>
                                <input
                                    onChange={handleChange}
                                    type="radio"
                                    id="externo"
                                    name="tipoEmpleado"
                                    value="1"
                                    checked={tipoEmpleado == 1}
                                />
                                <label htmlFor="externo" className="activa-cursor">Externo</label>
                            </div>
                        </fieldset>
                    </div>
                    <div className="contenedor-input">
                        <input
                            type="submit"
                            className="btn btn-primario btn-submit btn-block"
                            value={empleadoseleccionado ? 'Editar Empleado' : 'Agregar Empleado'}
                        />
                    </div>
                    {empleadoseleccionado ? (
                        <div className="contenedor-input">
                            <button
                                className="btn btn-warning btn-block"
                                onClick={eliminar}
                            >
                                Eliminar Empleado
                            </button>
                        </div>
                    ): null}
                </div>
            </form>

            {campoerror && Object.keys(campoerror).length > 0 ? (
                campoerror.map(item => {
                    return <p key={item.param} className="mensaje error">{ item.msg }</p>
                })
            ) : null }

        </div>
    );
}
