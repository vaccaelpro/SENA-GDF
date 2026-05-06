import React, { useState, useEffect, useRef } from "react";
import "../../css/IAFinance.css";
import Chart from "chart.js/auto";
import { FaPaperPlane, FaWallet } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const IAFinance = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const cargarDatos = async () => {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario) return;

      try {
        // Cargar historial
        const resHistorial = await axios.get(`/api/aprendiz/bot/historial?usuario_id=${usuario.id_usuario}`);
        setHistorial(resHistorial.data);
      } catch (error) {
        console.error("Error al cargar datos del bot", error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [historial]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Transporte", "Alimentación", "Personal"],
        datasets: [
          {
            data: [225000, 150000, 80000],
            backgroundColor: ["#dc3545", "#28a745", "#0d6efd"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
         chartInstance.current.destroy();
      }
    };
  }, []);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;
    
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      Swal.fire("Error", "No hay sesión activa", "error");
      return;
    }

    const nuevoMensaje = { tipo: 'CHAT_USUARIO', contenido: mensaje, fecha_interaccion: new Date() };
    setHistorial(prev => [...prev, nuevoMensaje]);
    setMensaje("");

    try {
      const res = await axios.post("/api/aprendiz/bot/chat", {
        usuario_id_usuario: usuario.id_usuario,
        mensaje: nuevoMensaje.contenido
      });
      
      const respuestaBot = { tipo: 'CHAT_BOT', contenido: res.data.respuesta, fecha_interaccion: new Date() };
      setHistorial(prev => [...prev, respuestaBot]);
    } catch (error) {
      Swal.fire("Error", "No se pudo comunicar con el bot", "error");
    }
  };

  return (
    <>
      <br />
      <div className="container p-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="ia-card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
              <div className="chat-messages p-3" style={{ flexGrow: 1, overflowY: 'auto' }}>
                <p><strong>Este es un espacio para el asistente IA Finance</strong></p>
                <p>
                  Pregunta lo que necesites sobre finanzas. Puedes preguntar por tu 'resumen' o tus 'metas'.
                </p>
                <hr />
                {historial.map((msg, idx) => (
                  <div key={idx} style={{ textAlign: msg.tipo === 'CHAT_USUARIO' || msg.tipo === 'FAQ' && msg.contenido.startsWith('Usuario') ? 'right' : 'left', marginBottom: '10px' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: msg.tipo === 'CHAT_USUARIO' || msg.tipo === 'FAQ' && msg.contenido.startsWith('Usuario') ? '#dcf8c6' : '#f1f0f0',
                      color: '#000',
                      maxWidth: '80%',
                      whiteSpace: 'pre-line'
                    }}>
                      <strong>{msg.tipo === 'CHAT_USUARIO' || msg.tipo === 'FAQ' && msg.contenido.startsWith('Usuario') ? 'Tú' : 'IA Finance'}:</strong> <br/>
                      {msg.contenido}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="chat-input-wrapper mt-3">
              <div className="chat-box" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ingresa una pregunta..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                  style={{ flexGrow: 1, border: 'none', outline: 'none' }}
                />
                <button className="chat-btn" onClick={enviarMensaje} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px' }}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card meta-card p-3">
              <h6 className="fw-bold">Meta De Ahorro</h6>
              <p className="text-muted">Apoyo</p>
              <h5 className="fw-bold text-success">Dinero Ahorrado</h5>
              <h4 className="fw-bold">---</h4>
              <small className="text-muted">Revisa la pestaña de metas</small>
            </div>

            <div className="card presupuesto-card p-3 mt-4">
              <h6 className="fw-bold d-flex align-items-center gap-2">
                <FaWallet /> Mi Presupuesto
              </h6>
              <p className="text-muted">
                Ingresa y contabiliza tus ingresos y egresos de este mes
              </p>
            </div>

            <div className="card categorias-card p-3 mt-4">
              <h6 className="fw-bold">Categorías de Gastos</h6>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IAFinance;