import "../../css/encuestas.css";
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";

const Encuestas = () => {
  const [preguntas, setPreguntas] = useState([1]);

  const agregarPregunta = () => {
    setPreguntas([...preguntas, preguntas.length + 1]);
  };

  return (
    <div className="contenido p-5">
      <div className="card encuesta-card shadow">
        <h2 className="mb-4">Crear Encuesta</h2>

        <form>
          <div className="mb-3">
            <label className="form-label fw-bold">Título de Encuesta</label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Ingresa tu título aquí"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Descripción</label>
            <textarea
              className="form-control custom-input"
              rows="2"
              placeholder="Ingresa la descripción aquí"
            ></textarea>
          </div>

          {/* CONTENEDOR DE PREGUNTAS */}
          <div id="preguntas-container">
            {preguntas.map((num) => (
              <div
                key={num}
                className="pregunta-box mb-3 p-3 border rounded"
              >
                <label className="form-label fw-bold">
                  Pregunta {num}
                </label>
                <input
                  type="text"
                  className="form-control custom-input mb-2"
                  placeholder="Ingresa la pregunta aquí"
                />

                <label className="form-label">Respuesta</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder="Placeholder"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarPregunta}
            className="btn btn-outline-success mb-3 d-flex align-items-center gap-2"
          >
            <FaPlusCircle />
            Agregar Pregunta
          </button>

          <button type="submit" className="btn btn-success w-100">
            Crear
          </button>
        </form>
      </div>
    </div>
  );
};

export default Encuestas;
