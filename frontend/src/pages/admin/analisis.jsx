import "../../css/analisis.css"
import { FaEye, FaDownload, FaEdit } from "react-icons/fa";

const Analisis = () =>{
    return(
        <div className="container mt-5 pt-5">
      <h3 className="mb-4 text-success">Encuestas</h3>

      <div className="card encuesta-card d-flex flex-row align-items-center justify-content-between p-3 mb-3 shadow">
        <div className="flex-fill text-center">
          <h5 className="mb-0">Encuesta de Satisfacción</h5>
        </div>

        <div className="d-flex flex-column align-items-start">
          <button className="btn btn-link text-success d-flex align-items-center mb-2">
            <FaEye className="me-2" />
            Analizar Resultados
          </button>

          <button className="btn btn-link text-success d-flex align-items-center mb-2">
            <FaDownload className="me-2" />
            Exportar Análisis
          </button>

          <button className="btn btn-link text-success d-flex align-items-center">
            <FaEdit className="me-2" />
            Editar Encuesta
          </button>
        </div>
      </div>
    </div>
    );
};

export default Analisis;