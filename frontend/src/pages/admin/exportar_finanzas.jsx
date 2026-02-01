import React, { useEffect, useRef } from "react";
import { FaDownload } from "react-icons/fa";
import Chart from "chart.js/auto";
import "../../css/exportar_finanzas.css"

const Exportar_finanzas = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const chartsRef = useRef({});

  useEffect(() => {
    const labels = ["Santiago", "Ana"];
    const ingresos = [2000000, 1500000];
    const gastos = [1200000, 500000];

    Object.values(chartsRef.current).forEach((chart) => chart.destroy());

    chartsRef.current.bar = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Ingresos", data: ingresos, backgroundColor: "#28a745" },
          { label: "Gastos", data: gastos, backgroundColor: "#dc3545" },
        ],
      },
      options: { responsive: true },
    });

    chartsRef.current.pie = new Chart(pieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Ingresos Totales", "Gastos Totales"],
        datasets: [
          {
            data: [ingresos.reduce((a, b) => a + b, 0), gastos.reduce((a, b) => a + b, 0)],
            backgroundColor: ["#28a745", "#dc3545"],
          },
        ],
      },
      options: { responsive: true },
    });

    return () => {
      Object.values(chartsRef.current).forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="contenido p-4">
      <h2 className="titulo-seccion">Exportación de Finanzas</h2>
      <p className="subtitulo">
        Descarga los registros financieros de los usuarios en formato Excel y
        visualiza el resumen en gráficas interactivas.
      </p>

      <div className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control custom-input"
          placeholder="Buscar usuario..."
          style={{ flex: 1 }}
        />
        <button className="btn btn-success px-4">
          <FaDownload /> Exportar
        </button>
      </div>

      <div className="table-responsive mb-5">
        <table className="table table-hover align-middle custom-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Ingresos</th>
              <th>Gastos</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Santiago Vacca</td>
              <td>123456789</td>
              <td>$2,000,000</td>
              <td>$1,200,000</td>
              <td><strong>$800,000</strong></td>
            </tr>
            <tr>
              <td>Ana Pérez</td>
              <td>987654321</td>
              <td>$1,500,000</td>
              <td>$500,000</td>
              <td><strong>$1,000,000</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow p-3">
            <h5 className="mb-3">Ingresos vs Gastos</h5>
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow p-3">
            <h5 className="mb-3">Distribución de Finanzas</h5>
            <canvas ref={pieChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exportar_finanzas;

