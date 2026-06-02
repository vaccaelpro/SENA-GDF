import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout";
import Layout_admin from "./components/layout_admin";

import Auth from "./pages/public/Auth";
import Repecuperar_contraseña1 from "./pages/public/Recuperarpass1";

import Novedades_aprendiz from "./pages/aprendiz/novedades_aprendiz";
import Satisfaccion_encuestas from "./pages/aprendiz/satisfaccion_encuestas";
import IAFinance from "./pages/aprendiz/IAFinance";
import Metas_de_ahorro from "./pages/aprendiz/metas_de_ahorro";
import IADocument from "./pages/aprendiz/IADocument";
import Mi_grupo from "./pages/aprendiz/mi_grupo";
import Chat_aprendiz from "./pages/aprendiz/chat_aprendiz";
import Agregar_meta from "./pages/aprendiz/agregar_meta";
import Agregar_monto from "./pages/aprendiz/agregar_monto";
import Editar_meta from "./pages/aprendiz/editar_meta";

import Agregar_novedad from "./pages/admin/Agregar_novedad";
import Eliminar_novedad from "./pages/admin/eliminar_novedad";
import Tabla_gestion_usuarios from "./pages/admin/gestion_usuarios";
import Exportar_finanzas from "./pages/admin/exportar_finanzas";
import Exportar_personal from "./pages/admin/exportar_personal";
import Encuestas from "./pages/admin/encuestas";
import Analisis from "./pages/admin/analisis";
import Lista_grupos from "./pages/admin/lista_grupos";
import Crear_grupo from "./pages/admin/crear_grupo";
import Chat_admin from "./pages/admin/chat_grupo";

import ProtectedRoute from "./components/shared/ProtectedRoute";
import Error404 from "./pages/public/Error404";
import RestablecerPassword from "./pages/public/Recuperarpass2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*Vistas que ven todos los roles*/}
        <Route path="/" element={<Auth />} />
        <Route path="/Registro" element={<Auth />} />
        <Route path="/Repecuperar_contraseña" element={<Repecuperar_contraseña1 />} />
        <Route path="/restablecer/:token" element={<RestablecerPassword />} />

        {/*Vistas de solo el aprendiz*/}
        <Route element={
          <ProtectedRoute allowedRole="USUARIO">
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/Novedades_aprendiz" element={<Novedades_aprendiz />} />
          <Route path="/Satisfaccion encuestas" element={<Satisfaccion_encuestas />} />
          <Route path="/IAFinance" element={<IAFinance />} />
          <Route path="/Metas_de_ahorro" element={<Metas_de_ahorro />} />
          <Route path="/IADocument" element={<IADocument />} />
          <Route path="/Mi_grupo" element={<Mi_grupo />} />
          <Route path="/Chat_aprenidiz" element={<Chat_aprendiz />} />
          <Route path="/Agregar_meta" element={<Agregar_meta />} />
          <Route path="/Agregar_monto" element={<Agregar_monto />} />
          <Route path="/Editar_meta" element={<Editar_meta />} />
        </Route>

        {/*Vistas del administrador*/}
        <Route element={
          <ProtectedRoute allowedRole="ADMIN">
            <Layout_admin />
          </ProtectedRoute>
        }>
          <Route path="/Agregar_novedad" element={<Agregar_novedad />} />
          <Route path="/Agregar_novedad/:id" element={<Agregar_novedad />} />
          <Route path="/Eliminar_novedad" element={<Eliminar_novedad />} />
          <Route path="/Tabla_gestion_usuarios" element={<Tabla_gestion_usuarios />} />
          <Route path="/Exportar_finanzas" element={<Exportar_finanzas />} />
          <Route path="/Exportar_personal" element={<Exportar_personal />} />
          <Route path="/Encuestas" element={<Encuestas />} />
          <Route path="/Analisis" element={<Analisis />} />
          <Route path="/Lista_grupos" element={<Lista_grupos />} />
          <Route path="/Crear_grupo" element={<Crear_grupo />} />
          <Route path="/Chat_admin/:id" element={<Chat_admin />} />
        </Route>

        {/* Ruta para capturar cualquier otra URL inexistente */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

