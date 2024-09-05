import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlertaContext from '../../context/alertas/alertaContext';
import AuthContext from '../../context/autenticacion/authContext';

export default function Login(props) {

    let navigate = useNavigate();

    // extraer los valores del context
    const alertaContext = useContext(AlertaContext);
    const { alerta, mostrarAlerta } = alertaContext;

    const authContext = useContext(AuthContext);
    const { mensaje, autenticado, iniciarSesion } = authContext;

    // En caso de que el password o empleado no exista
    useEffect(() => {

        if (autenticado) {
            navigate('proyectos');
        }

        if (mensaje) {
            mostrarAlerta(mensaje.msg, mensaje.categoria);
        }
        // eslint-disable-next-line
    },[mensaje, autenticado, props.history]);


    // State para iniciar sesión
    const [empleado, guardarEmpleado] = useState({
        numEmpleado: '',
        password: ''
    });

    // extraer el empleado
    const { numEmpleado, password } = empleado;

    const onChange = e => {

        guardarEmpleado({
            ...empleado,
            [e.target.name] : e.target.value
        })

    }

    const onSubmit = e => {

        e.preventDefault();

        // validar que no haya campos vacios
        if (numEmpleado.trim() === '' || password.trim() === '') {
            mostrarAlerta('Todos los campos son obligatorios', 'alerta-error');
            return;
        }

        // Pasar al action
        iniciarSesion({ numEmpleado, password});

    }

    return (
        <div className="form-usuario">
            { alerta ? (<div className={`alerta ${alerta.categoria}`}>{alerta.msg}</div>) : null }
            <div className="contenedor-form sombra-dark">
                <h1>Iniciar Sesión</h1>

                <form
                    onSubmit={onSubmit}
                >
                    <div className="campo-form">
                        <label htmlFor="numEmpleado">Número Empleado</label>
                        <input
                            type="number"
                            id="numEmpleado"
                            name="numEmpleado"
                            placeholder="Número empleado"
                            value={numEmpleado}
                            onChange={onChange}
                        />
                    </div>
                    <div className="campo-form">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={onChange}
                        />
                    </div>
                    <div className="campo-form">
                        <input
                            type="submit"
                            className="btn btn-primario btn-block"
                            value="Iniciar Sesión"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
