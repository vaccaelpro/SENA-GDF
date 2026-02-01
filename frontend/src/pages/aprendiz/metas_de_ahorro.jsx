import "../../css/metas_de_ahorro.css"
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";

const Metas_de_ahorro = () => {
  return (
    <section className="contenido">
      <h2>Metas de Ahorro</h2>

      <div className="grid">
        <div className="card">
          <h3>Ahorro 1</h3>
          <p>1.000 $ Ahorrados</p>
          <p>Fecha Ingreso: xx / xx / xxxx</p>
          <div className="botones">
            <Link to="/Editar_meta" className="btn edit">
              <FaEdit /> Editar
            </Link>
            <button className="eliminar">
              <FaTrash /> Borrar
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Ahorro 2</h3>
          <p>1.000 $ Ahorrados</p>
          <p>Fecha Ingreso: xx / xx / xxxx</p>
          <div className="botones">
            <Link to="/Editar_meta" className="btn edit">
              <FaEdit /> Editar
            </Link>
            <button className="eliminar">
              <FaTrash /> Borrar
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Ahorro 3</h3>
          <p>1.000 $ Ahorrados</p>
          <p>Fecha Ingreso: xx / xx / xxxx</p>
          <div className="botones">
            <Link to="/Editar_meta" className="btn edit">
              <FaEdit /> Editar
            </Link>
            <button className="eliminar">
              <FaTrash /> Borrar
            </button>
          </div>
        </div>

        <div className="card añadir">
          <Link to="/Agregar_meta" className="añadir-btn">
            <FaPlusCircle /> Agregar meta
          </Link>
          <Link to="/Agregar_monto" className="añadir-btn">
            <FaPlusCircle /> Agregar Monto
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Metas_de_ahorro;