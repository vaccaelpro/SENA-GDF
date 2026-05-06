import "../css/header.css";
import { useEffect, useState } from "react";
import { FaUserCircle, FaCaretDown, FaBell } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const Header = () => {
  const [hora, setHora] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

    const cargarUsuarioYNotificaciones = async () => {
      const usuarioStorage = localStorage.getItem("usuario");
      if (usuarioStorage) {
        try {
          const usuario = JSON.parse(usuarioStorage);
          setNombreUsuario(`${usuario.primer_nombre || ""} ${usuario.primer_apellido || ""}`.trim());

          // Consultar notificaciones
          const res = await axios.get(`/api/aprendiz/notificaciones?usuario_id=${usuario.id_usuario}`);
          setNotificaciones(res.data);
          
          // Mostrar alerta si hay notificaciones no leídas
          const noLeidas = res.data.filter(n => !n.leida);
          if (noLeidas.length > 0 && !sessionStorage.getItem('notificacionMostrada')) {
             Swal.fire("Alerta Financiera", "Tienes notificaciones de sobregiro o gastos excesivos.", "warning");
             sessionStorage.setItem('notificacionMostrada', 'true');
          }
        } catch (error) {
          console.error("Error cargando usuario o notificaciones", error);
        }
      }
    };

    cargarUsuarioYNotificaciones();

    return () => clearInterval(interval);
  }, []);

  const marcarComoLeida = async (id) => {
    try {
      await axios.put(`/api/aprendiz/notificaciones/${id}/leida`);
      setNotificaciones(prev => prev.map(n => n.id_notificacion === id ? { ...n, leida: 1 } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="text-white p-4 d-flex justify-content-between align-items-center header-fixed" style={{position: 'relative', zIndex: 999}}>
      <div>
        <h5 className="titulo">Bienvenido, {nombreUsuario || "Aprendiz"}</h5>
        <p>Mantente al día en la administración de tus ingresos</p>
      </div>

      <div className="d-flex align-items-center">
        <div style={{ position: 'relative', marginRight: '20px', cursor: 'pointer' }} onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}>
          <FaBell size={24} color="#f0ad4e" />
          {noLeidas > 0 && (
             <span style={{ position: 'absolute', top: '-5px', right: '-10px', background: 'red', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}>
               {noLeidas}
             </span>
          )}
        </div>

        {mostrarNotificaciones && (
          <div style={{ position: 'absolute', top: '70px', right: '150px', background: 'white', color: 'black', width: '300px', maxHeight: '300px', overflowY: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', padding: '10px' }}>
             <h6 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Notificaciones</h6>
             {notificaciones.length === 0 ? <p style={{fontSize: '12px', color: '#666'}}>No tienes notificaciones.</p> : 
               notificaciones.map(n => (
                 <div key={n.id_notificacion} style={{ padding: '8px', borderBottom: '1px solid #f9f9f9', background: n.leida ? 'transparent' : '#fff3cd', cursor: 'pointer' }} onClick={() => !n.leida && marcarComoLeida(n.id_notificacion)}>
                   <p style={{ margin: 0, fontSize: '13px' }}>{n.mensaje}</p>
                   <small style={{ color: '#888', fontSize: '11px' }}>{new Date(n.fecha).toLocaleString()}</small>
                 </div>
               ))
             }
          </div>
        )}

        <FaUserCircle className="me-2 header-icon" />
        <span>{nombreUsuario || "Aprendiz"}</span>
        <FaCaretDown className="ms-1 me-3 header-icon-small" />
        <span>{hora}</span>
      </div>
    </div>
  );
};

export default Header;
