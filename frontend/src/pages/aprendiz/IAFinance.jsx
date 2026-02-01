import "../../css/IAFinance.css"
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { FaPaperPlane, FaWallet } from "react-icons/fa";

const IAFinance = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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
      chartInstance.current.destroy();
    };
  }, []);

  return (
    <>
      <br />
      <div className="container p-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="ia-card">
              <div className="chat-messages p-3">
                <p><strong>Este es un espacio para el asistente IA Finance</strong></p>
                <p>
                  Pregunta lo que necesites sobre finanzas.
                  <br />
                  El bot estará aquí para ayudarte :)
                </p>
              </div>
            </div>

            <div className="chat-input-wrapper mt-3">
              <div className="chat-box">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ingresa una pregunta para hablar"
                />
                <button className="chat-btn">
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
              <h4 className="fw-bold">$950,500 COP</h4>
              <small className="text-muted">
                Dinero predispuesto para cada mes
              </small>
              <p className="fw-bold mt-2">$750,000 COP</p>
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