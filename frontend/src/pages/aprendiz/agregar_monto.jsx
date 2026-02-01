import "../../css/agregar_monto.css"
import { Link } from "react-router-dom";

const Agregar_monto = () =>{
    return(
        <div className="main-content">
  <section className="formulario-monto">
    <h2>Añadir Monto</h2>

    <div className="formulario">
      <label style={{ fontSize: "15px" }}>
        Ingresar monto para tu ahorro:
      </label>

      <input
        type="text"
        placeholder="Ingresar monto"
        style={{ fontSize: "17px" }}
      />

      <label>Selecciona una meta de ahorro:</label>

      <select style={{ fontSize: "17px" }}>
        <option value="">Selecciona</option>
        <option value="ahorro1">Ahorro 1</option>
        <option value="ahorro2">Ahorro 2</option>
        <option value="ahorro3">Ahorro 3</option>
      </select>

      <Link to="/Metas_de_ahorro">
        <button className="btn-añadir">Añadir</button>
      </Link>
    </div>
  </section>
</div>

    );
};

export default Agregar_monto;