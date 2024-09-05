import React, { Fragment, useContext, useState, useEffect } from 'react';
import empleadoContext from '../../context/empleados/empleadoContext';
import ProyectoContext from '../../context/proyectos/proyectoContext';
import MovimientoContext from '../../context/movimientos/movimientoContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';

export default function ListadoMovimientos() {

    // Fecha inicio
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [diasLaborables, setDiasLaborables] = useState("");
    const [totalEntregas, setTotalEntregas] = useState("");

    // Obtener el Sate de proyectos
    const proyectosContext = useContext(ProyectoContext);
    const { sueldobase, grabarNomina } = proyectosContext;

    // Obtener la funcion del context de empleado
    const empleadosContext = useContext(empleadoContext);
    const { empleados } = empleadosContext;

    // state de empleados
    const [empleadosState, guardarEmpleadosState] = useState([]);

    useEffect(() => {
        limpiarEmpleadosState();
    }, [empleados]);

    useEffect(() => {
        if (diasLaborables > 0) {
            calcularSueldo();
        } else {
            limpiarEmpleadosState();
        }
    }, [diasLaborables]);

    function limpiarEmpleadosState() {
        for (const empleado of empleados) {
            empleado.sueldobase = 0;
            empleado.sueldoNeto = 0;
            empleado.bonoAdicional = 0;
            empleado.bonoEntregas = 0;
            empleado.bonoDespensa = 0;
            empleado.ISR = 0;
            empleado.numEntregas = "";
            empleado.editar = false;
            empleado.detalle = false;
            empleado.cubrioTurno = false;
            empleado.puestoCubierto = "";
            empleado.fechaInicio = null;
            empleado.fechaFin = null;
        }
        guardarEmpleadosState(empleados);
    }

    function sumatoriaDeCantidades(empleadoActual) {
        empleadoActual.bonoEntregas = 0;
        empleadoActual.bonoAdicional = 0;
        empleadoActual.bonoDespensa = 0;
        empleadoActual.sueldoBase = 0;
        empleadoActual.sueldoNeto = 0;
        empleadoActual.ISR = 0;
        empleadoActual.sueldoBase = parseFloat(sueldobase.valor) * (parseFloat(diasLaborables) * 8);
        if (empleadoActual.rolEmpleado == 0) {
            empleadoActual.bonoAdicional = (10 * 8) * parseFloat(diasLaborables);
        } else if (empleadoActual.rolEmpleado == 1) {
            empleadoActual.bonoAdicional = (5 * 8) * parseFloat(diasLaborables);
        } else if (empleadoActual.rolEmpleado == 2) {
            if (empleadoActual.cubrioTurno) {
                if (empleadoActual.puestoCubierto == 0) {
                    empleadoActual.bonoAdicional = (10 * 8) * parseFloat(diasLaborables);
                } else if (empleadoActual.puestoCubierto == 1) {
                    empleadoActual.bonoAdicional = (5 * 8) * parseFloat(diasLaborables);
                }
            }
        }

        // BONO POR ENTREGAS
        if (empleadoActual.numEntregas) {
            empleadoActual.bonoEntregas += parseInt(empleadoActual.numEntregas) * 5;
        }

        // Sumatoria de cantidades
        // SUELDO BASE + BONO ADICIONAL + BONO ENTREGAS + BONO DESPENSA
        empleadoActual.sueldoNeto += empleadoActual.sueldoBase + empleadoActual.bonoAdicional + empleadoActual.bonoEntregas + empleadoActual.bonoDespensa;

        // APLICA BONO DE DESPENSA
        if (empleadoActual.tipoEmpleado == 0) {
            empleadoActual.bonoDespensa = empleadoActual.sueldoNeto * .04;
        }

        // IMPUESTOS
        empleadoActual.ISR = (empleadoActual.sueldoNeto) * .09;
        if (empleadoActual.sueldoNeto > 16000) {
            empleadoActual.ISR += (empleadoActual.sueldoNeto) * .03;
        }
        empleadoActual.sueldoNeto -= empleadoActual.ISR;

        empleadoActual.sueldoNeto += empleadoActual.bonoDespensa;

        return empleadoActual;
    }

    function calcularSueldo(unoSolo, empleado) {
        if (parseFloat(diasLaborables) > 0) {
            if (unoSolo) {
                let todosLosEmpleados = [...empleadosState];
                for (let x = 0; x < empleadosState.length; x++) {

                    if (empleado == empleadosState[x].numEmpleado) {

                        let empleadoActual = { ...empleadosState[x] };

                        empleadoActual = sumatoriaDeCantidades(empleadoActual);

                        // Ocultar edición
                        empleadoActual.editar = false;

                        todosLosEmpleados[x] = empleadoActual;

                        guardarEmpleadosState(todosLosEmpleados);
                        break
                    }
                }
            } else {
                let todosLosEmpleados = [...empleadosState];
                for (let x = 0; x < empleadosState.length; x++) {

                    let empleadoActual = { ...empleadosState[x] };

                    empleadoActual.fechaInicio = fechaInicio;
                    empleadoActual.fechaFin = fechaFin;
                    empleadoActual = sumatoriaDeCantidades(empleadoActual);

                    todosLosEmpleados[x] = empleadoActual;
                    guardarEmpleadosState(todosLosEmpleados);
                }
            }
        }
    }

    const editarEmpleado = (e) => {
        const numEmpleado = e.target.name;
        for (let x = 0; x < empleadosState.length; x++) {
            if (empleadosState[x].numEmpleado == numEmpleado) {
                let items = [...empleadosState];
                let item = { ...empleadosState[x] };
                if (e.target.id == "btnVerDetalle") {
                    item.detalle = item.detalle ? !item.detalle : true;
                } else {
                    item.editar = item.editar ? !item.editar : true;
                }
                items[x] = item;
                guardarEmpleadosState(items);
                break;
            }
        }
    }

    const agregarEntregas = (e, numEmpleado) => {
        // if (e.target.value == "" || !parseInt(e.target.value)) {
        //     e.preventDefault();
        // }
        if (parseInt(e.target.value) > 0) {
            for (let x = 0; x < empleadosState.length; x++) {
                if (empleadosState[x].numEmpleado == numEmpleado) {
                    let items = [...empleadosState];
                    let item = { ...empleadosState[x] };
                    item.numEntregas = parseInt(e.target.value);
                    items[x] = item;
                    guardarEmpleadosState(items);
                    break;
                }
            }
        } else {
            for (let x = 0; x < empleadosState.length; x++) {
                if (empleadosState[x].numEmpleado == numEmpleado) {
                    let items = [...empleadosState];
                    let item = { ...empleadosState[x] };
                    item.numEntregas = e.target.value;
                    items[x] = item;
                    guardarEmpleadosState(items);
                    break;
                }
            }
        }
    }

    const agregarModificaciones = (e) => {
        calcularSueldo(true, e.target.name);
    }

    const guardarCubrirPuesto = (numEmpleado, bandera, opc) => {
        for (let x = 0; x < empleadosState.length; x++) {
            if (empleadosState[x].numEmpleado == numEmpleado) {
                let items = [...empleadosState];
                let item = { ...empleadosState[x] };
                if (bandera) {
                    item.puestoCubierto = opc;
                } else {
                    item.cubrioTurno = !item.cubrioTurno;
                }
                items[x] = item;
                guardarEmpleadosState(items);
                break;
            }
        }
    }

    const onClickGrabarNomina = () => {
        grabarNomina(empleadosState);
        limpiarEmpleadosState();
        setFechaInicio(null);
        setFechaFin(null);
        setDiasLaborables("");
    }

    if (!empleadosState || empleados.length === 0) return <h2>No existen empleados registrados</h2>

    return (
        <Fragment>
            <h3>Captura de Nomina</h3>
            <div style={{ marginTop: "4rem" }}>
                <label style={{ marginRight: "2rem" }}>Fecha Inicio</label>
                <DatePicker onChange={setFechaInicio} value={fechaInicio} />
                <label style={{ marginRight: "2rem", marginLeft: "2rem" }}>Fecha Fin</label>
                <DatePicker onChange={setFechaFin} value={fechaFin} />
            </div>

                {fechaInicio && fechaFin ? (
                    <>
                        <div style={{width: "10%", display: "inline-block", marginTop: "2rem"}}>
                            <label htmlFor="diasTrabajados">Días Laborados</label>
                            <div className="contenedor-input">
                                <input
                                    type="number"
                                    className="input-text"
                                    placeholder="0"
                                    name="diasTrabajados"
                                    value={diasLaborables}
                                    onChange={(e) => { parseInt(e.target.value) ? setDiasLaborables(e.target.value) : setDiasLaborables("") }}
                                />
                            </div>
                        </div>
                    <ul className="listado-tareas">
                        <TransitionGroup>
                            {empleadosState.map(empleado => (
                                <CSSTransition
                                    key={empleado._id}
                                    timeout={200}
                                    classNames="tarea"
                                >
                                    {/* <Tarea
                                tarea={empleado}
                            /> */}
                                    <li className="sombra">
                                        <div className="tarea">
                                            <div style={{ width: "30%" }}>
                                                <p style={{ textAlign: "left" }}>{`${empleado.numEmpleado} - ${empleado.nombre} ${empleado.apPaterno} ${empleado.apMaterno}`}</p>
                                                <p style={{ textAlign: "left", fontSize: "1.2rem" }}>{empleado.rolEmpleado == 0 ? "Chofer" : empleado.rolEmpleado == 1 ? "Cargador" : "Auxiliar"} - {empleado.tipoEmpleado == 0 ? "Interno" : "Externo"}</p>
                                            </div>

                                            <div className="estado" style={{ textAlign: "right", width: "30%" }}>
                                                <label htmlFor="total">Total: ${empleado.sueldoNeto && empleado.sueldoNeto >= 0 ? (empleado.sueldoNeto) : ("0")}</label>
                                            </div>

                                            {!empleado.detalle && diasLaborables > 0 ? (
                                                <div className="acciones">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primario"
                                                        id="btnVerDetalle"
                                                        name={empleado.numEmpleado}
                                                        onClick={(e) => { editarEmpleado(e) }}
                                                    >Ver detalle</button>
                                                </div>
                                            ) : diasLaborables > 0 ? (
                                                <div className="acciones">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primario"
                                                        id="btnVerDetalle"
                                                        name={empleado.numEmpleado}
                                                        onClick={(e) => { editarEmpleado(e) }}
                                                    >Ocultar detalle</button>
                                                </div>
                                            ) : null}

                                            {!empleado.editar && diasLaborables > 0 ? (
                                                <div className="acciones">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primario"
                                                        id="btnEditar"
                                                        name={empleado.numEmpleado}
                                                        onClick={(e) => { editarEmpleado(e) }}
                                                    >Editar</button>
                                                </div>
                                            ) : diasLaborables > 0 ? (
                                                <div className="acciones">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primario"
                                                        name={empleado.numEmpleado}
                                                        onClick={(e) => { agregarModificaciones(e) }}
                                                    >Aceptar</button>
                                                </div>
                                            ) : null}
                                        </div>
                                        {empleado.editar ? (
                                            <div className="tarea" id="contenido-editar">
                                                <div className="cont-form">
                                                    <div className="contenedor-input">
                                                        <label htmlFor="nombre">Cantidad de entregas:</label>
                                                    </div>
                                                    <div className="contenedor-input">
                                                        <input
                                                            type="number"
                                                            className="input-text"
                                                            placeholder="0"
                                                            name="totalEntregas"
                                                            value={empleado.numEntregas}
                                                            onChange={(e) => { agregarEntregas(e, empleado.numEmpleado) }}
                                                        />
                                                    </div>
                                                </div>
                                                {empleado.rolEmpleado == 2 ? (
                                                    <>
                                                        <div className="cont-form">
                                                            <div className="contenedor-input">
                                                                <label htmlFor="nombre">Cubrio turno:</label>
                                                            </div>
                                                            <div className="contenedor-input">
                                                                <input
                                                                    type="checkbox"
                                                                    className="input-text"
                                                                    name="cubrioPuesto"
                                                                    value={empleado.cubrioTurno}
                                                                    onClick={() => guardarCubrirPuesto(empleado.numEmpleado, false, null)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {empleado.cubrioTurno ? (
                                                                <fieldset>
                                                                    <legend>¿Rol cubierto?:</legend>
                                                                    <div style={{ display: "inline-block" }}>
                                                                        <input
                                                                            type="radio"
                                                                            id="chofer"
                                                                            name="rolEmpleado"
                                                                            value={empleado.puestoCubierto}
                                                                            onClick={() => guardarCubrirPuesto(empleado.numEmpleado, true, 0)}
                                                                        />
                                                                        <label htmlFor="chofer" className="activa-cursor">Chofer</label>
                                                                    </div>
                                                                    <div style={{ display: "inline-block" }}>
                                                                        <input
                                                                            type="radio"
                                                                            id="cargador"
                                                                            name="rolEmpleado"
                                                                            value={empleado.puestoCubierto}
                                                                            onClick={() => guardarCubrirPuesto(empleado.numEmpleado, true, 1)}
                                                                        />
                                                                        <label htmlFor="cargador" className="activa-cursor">Cargador</label>
                                                                    </div>
                                                                </fieldset>
                                                            ) : null}
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        ) : null}
                                        {empleado.detalle ? (
                                            <div className="tarea" id="contenido-editar" style={{ alignItems: "flex-start" }}>
                                                <div className="cont-form">
                                                    <h5>Ingresos</h5>
                                                    <div className="contenedor-input">
                                                        <label htmlFor="nombre"><strong>Sueldo base.............</strong>${empleado.sueldoBase}</label>
                                                    </div>
                                                    <div className="contenedor-input">
                                                        <label htmlFor="nombre"><strong>Bono adicional..........</strong>${empleado.bonoAdicional}</label>
                                                    </div>
                                                    <div className="contenedor-input">
                                                        <label htmlFor="nombre"><strong>Bono por entregas.......</strong>${empleado.bonoEntregas}</label>
                                                    </div>
                                                    <div className="contenedor-input">
                                                        <label htmlFor="nombre"><strong>Bono despensa...........</strong>${empleado.bonoDespensa}</label>
                                                    </div>
                                                </div>
                                                <div className="cont-form">
                                                    <h5>Egresos</h5>
                                                    <div className="contenedor-input">
                                                        <label htmlFor="nombre"><strong>ISR.............</strong>${empleado.ISR}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                    </li>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </ul>
                    {diasLaborables > 0 ? (
                        <button
                            type="button"
                            className="btn btn-grabar"
                            onClick={onClickGrabarNomina}
                        >Grabar nomina</button>
                    ) : null}
                    </>
                ) : null}
        </Fragment>
    );
}
