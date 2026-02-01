import "../../css/agregar_meta.css"
import { Link } from "react-router-dom";

const Agregar_meta = () =>{
    return(
    <section className="formulario-meta">
  <h2>Crear meta de ahorro</h2>

  <div className="formulario">
    <label>Nombre del ahorro:</label>
    <input type="text" placeholder="Ingresar Nombre" />

    <label>Descripción del ahorro:</label>
    <textarea placeholder="Ingresar descripción"></textarea>

    <label>Monto inicial del ahorro:</label>
    <input type="number" placeholder="Ingresar monto" />

    <Link to="/Metas_de_ahorro">
      <button className="btn-crear">Crear</button>
    </Link>
  </div>
</section>

    );
};

export default Agregar_meta;