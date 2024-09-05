import { useState } from 'react'

import { Routes, Route, Navigate, Link } from "react-router-dom";

import Login from './components/auth/Login';
import Main from './components/dashboard/main';

import './App.css'

import ProyectoState from './context/proyectos/proyectoState';
import EmpleadoState from './context/empleados/empleadoState';
import AlertaState from './context/alertas/alertaState';
import AuthState from './context/autenticacion/authState';
import tokenAuth from './config/tokenAuth';
import RutaPrivada from './components/rutas/RutaPrivada';

function App() {
  const [count, setCount] = useState(0)

  return (
    <ProyectoState>
      <EmpleadoState>
        <AlertaState>
          <AuthState>
            <Routes>
              <Route exact path={'/'} element={<Login />} />
              <Route
                path={'/proyectos'}
                element={<RutaPrivada><Main /></RutaPrivada>}
              />

            </Routes>
          </AuthState>
        </AlertaState>
      </EmpleadoState>
    </ProyectoState>
  )
}

export default App
