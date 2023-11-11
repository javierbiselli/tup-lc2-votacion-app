const tipoEleccion = 2;
const tipoRecuento = 1;

const loader = document.getElementById("loader");

const mensajeVerde = document.getElementById("success");
const mensajeAmarillo = document.getElementById("warning");
const mensajeRojo = document.getElementById("error");

const selectAnio = document.getElementsByClassName("selectAnio")[0];

async function llenarselectAnio() {
  try {
    const response = await fetch(
      "https://resultados.mininterior.gob.ar/api/menu/periodos"
    );

    if (response.ok) {
      const data = await response.json();

      data.forEach((periodo) => {
        const option = document.createElement("option");
        option.value = periodo;
        option.innerText = periodo;
        selectAnio.appendChild(option);
      });
    } else {
      Alert("Ha ocurrido un error");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

llenarselectAnio();

const selectCargo = document.getElementsByClassName("selectCargo")[0];
var jsonCargos;

async function llenarSelectCargo() {
  selectCargo.innerHTML = "";
  try {
    const anioSeleccionado = selectAnio.value;

    if (anioSeleccionado && anioSeleccionado !== "Año") {
      const response = await fetch(
        "https://resultados.mininterior.gob.ar/api/menu?año=" + anioSeleccionado
      );

      if (response.ok) {
        const data = await response.json();
        jsonCargos = data; // guardo los datos de cargos en una variable global para usarla en otros lados

        const optionPr = document.createElement("option");
        optionPr.value = "Cargo";
        optionPr.innerText = "Cargo";
        selectCargo.appendChild(optionPr);

        data.forEach((eleccion) => {
          if (eleccion.IdEleccion === tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
              const option = document.createElement("option");
              option.value = cargo.IdCargo;
              option.text = cargo.Cargo;
              selectCargo.appendChild(option);
            });
          }
        });
        llenarSelectDistrito();
      } else {
        Alert("Ha ocurrido un error");
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const selectDistrito = document.getElementsByClassName("selectDistrito")[0];

async function llenarSelectDistrito() {
  selectDistrito.innerHTML = "";
  try {
    const anioSeleccionado = selectAnio.value;
    const cargoSeleccionado = selectCargo.value;

    if (
      anioSeleccionado &&
      anioSeleccionado !== "Año" &&
      cargoSeleccionado &&
      cargoSeleccionado !== "Cargo"
    ) {
      const datosFiltros = jsonCargos; //uso el json de cargos que ya pedi antes

      // filtro por ideleccion
      const eleccionesFiltradas = datosFiltros.filter(
        (eleccion) => eleccion.IdEleccion === tipoEleccion
      );

      // filtro por idcargo
      const cargoSeleccionadoObj = eleccionesFiltradas[0].Cargos.filter(
        (cargo) => cargo.IdCargo === cargoSeleccionado
      );

      if (cargoSeleccionadoObj) {
        const distritos = cargoSeleccionadoObj[0].Distritos;

        const optionPr = document.createElement("option");
        optionPr.value = "Distrito";
        optionPr.innerText = "Distrito";
        selectDistrito.appendChild(optionPr);

        distritos.forEach((distrito) => {
          const option = document.createElement("option");
          option.value = distrito.IdDistrito;
          option.text = distrito.Distrito;
          selectDistrito.appendChild(option);
        });
        llenarSelectSeccion();
      }
    } else {
      // esto es para borrar el contenido del select de distritos cuando no se selecciona anio o cargo
      selectDistrito.innerHTML = "";
      const primerOpt = document.createElement("option");
      primerOpt.innerText = "Distrito";
      selectDistrito.appendChild(primerOpt);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const selectSeccion = document.getElementsByClassName("selectSeccion")[0];
const hdSeccionProvincial = document.getElementById("hdSeccionProvincial");

async function llenarSelectSeccion() {
  selectSeccion.innerHTML = "";
  hdSeccionProvincial.value = "";
  try {
    const anioSeleccionado = selectAnio.value;
    const cargoSeleccionado = selectCargo.value;
    const distritoSeleccionado = selectDistrito.value;

    if (
      anioSeleccionado &&
      anioSeleccionado !== "Año" &&
      cargoSeleccionado &&
      cargoSeleccionado !== "Cargo" &&
      distritoSeleccionado &&
      distritoSeleccionado !== "Distrito"
    ) {
      const datosFiltros = jsonCargos;

      // filtro por ideleccion
      const eleccionesFiltradas = datosFiltros.filter(
        (eleccion) => eleccion.IdEleccion === tipoEleccion
      );

      // filtro por idcargo
      const cargoSeleccionadoObj = eleccionesFiltradas[0].Cargos.filter(
        (cargo) => cargo.IdCargo === cargoSeleccionado
      );

      // filtro por distrito
      const distritoSeleccionadoObj = cargoSeleccionadoObj[0].Distritos.filter(
        (distrito) => distrito.IdDistrito == distritoSeleccionado
      );

      hdSeccionProvincial.value =
        distritoSeleccionadoObj[0].SeccionesProvinciales[0].IDSeccionProvincial;

      const secciones =
        distritoSeleccionadoObj[0].SeccionesProvinciales[0].Secciones;

      const optionPr = document.createElement("option");
      optionPr.value = "Sección";
      optionPr.innerText = "Sección";
      selectSeccion.appendChild(optionPr);
      secciones.forEach((seccion) => {
        const option = document.createElement("option");
        option.value = seccion.IdSeccion;
        option.text = seccion.Seccion;
        selectSeccion.appendChild(option);
      });
    } else {
      selectSeccion.innerHTML = "";
      const primerOpt = document.createElement("option");
      primerOpt.innerText = "Sección";
      selectSeccion.appendChild(primerOpt);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function borrarSelects() {
  if (selectAnio.value === "Año") {
    selectCargo.value = null;
    selectDistrito.value = null;
    hdSeccionProvincial.value = null;
    selectSeccion.value = null;

    selectCargo.innerHTML = "";
    const primerOptCargo = document.createElement("option");
    primerOptCargo.innerText = "Cargo";
    selectCargo.appendChild(primerOptCargo);

    selectDistrito.innerHTML = "";
    const primerOptDist = document.createElement("option");
    primerOptDist.innerText = "Distrito";
    selectDistrito.appendChild(primerOptDist);

    selectSeccion.innerHTML = "";
    const primerOptSec = document.createElement("option");
    primerOptSec.innerText = "Seccion";
    selectSeccion.appendChild(primerOptSec);
  }

  if (selectCargo.value === "Cargo") {
    selectDistrito.value = null;
    hdSeccionProvincial.value = null;
    selectSeccion.value = null;

    selectDistrito.innerHTML = "";
    const primerOptDist = document.createElement("option");
    primerOptDist.innerText = "Distrito";
    selectDistrito.appendChild(primerOptDist);

    selectSeccion.innerHTML = "";
    const primerOptSec = document.createElement("option");
    primerOptSec.innerText = "Seccion";
    selectSeccion.appendChild(primerOptSec);
  }
}

var dataResponse;

async function filtrarResultados() {
  const anioEleccion = selectAnio.value;
  const categoriaId = selectCargo.value;
  const distritoId = selectDistrito.value;
  const seccionProvincialId = hdSeccionProvincial.value;
  const seccionId = selectSeccion.value;
  const circuitoId = "";
  const mesaId = "";

  //   console.log("anio", anioEleccion);
  //   console.log("categoria", categoriaId);
  //   console.log("distrito", distritoId);
  //   console.log("seccion", seccionProvincialId);
  //   console.log("seccionid", seccionId);

  if (
    !anioEleccion ||
    anioEleccion == "Año" ||
    !categoriaId ||
    categoriaId == "Cargo" ||
    !distritoId ||
    distritoId == "Distrito" ||
    !seccionId ||
    seccionId == "Sección"
  ) {
    console.log("Falta seleccionar algún campo");

    const mensaje =
      anioEleccion == "Año"
        ? "No seleccionó el año"
        : categoriaId == "Cargo"
        ? "No seleccionó el cargo"
        : distritoId == "Distrito"
        ? "No seleccionó el distrito"
        : seccionId == "Sección"
        ? "No seleccionó la seccion"
        : "";
    mensajeAmarillo.style.display = "block";
    mensajeAmarillo.innerHTML = `<p><i class="fa-solid fa-exclamation"></i> Falta seleccionar algún campo: ${mensaje}</p>`;
    return;
  }

  try {
    loader.style.display = "block";
    const response = await fetch(
      `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`
    );

    if (response.ok) {
      const data = await response.json();
      loader.style.display = "none";
      console.log("Respuesta:", data);

      dataResponse = data;
      mensajeAmarillo.style.display = "none";
      generales.style.visibility = "visible";

      const titulo = document.getElementsByClassName("titulo-h1")[0];
      const textoPath = document.getElementsByClassName("texto-path")[0];

      titulo.innerText = `Elecciones ${anioEleccion} | Generales`;

      const opcionSeleccionadaCargo =
        selectCargo.options[selectCargo.selectedIndex];
      const opcionSeleccionadaDist =
        selectDistrito.options[selectDistrito.selectedIndex];

      textoPath.innerText = `${anioEleccion} > Generales > Provisorio > ${opcionSeleccionadaCargo.text} > ${opcionSeleccionadaDist.text}`;

      const mesasEscrutadas = document.getElementById("mesas-escrutadas");
      const electores = document.getElementById("electores");
      const participacion = document.getElementById("participacion");

      mesasEscrutadas.innerText = data.estadoRecuento.mesasTotalizadas;
      electores.innerText = data.estadoRecuento.cantidadElectores;
      participacion.innerText = `${data.estadoRecuento.participacionPorcentaje}%`;

      llenarAgrupacionPolitica();
      llenarResumenVotos();

      const mapa = mapas.find(
        (mapas) =>
          mapas.provincia.toLowerCase() ==
          opcionSeleccionadaDist.text.toLowerCase()
      );
      const provincia = document.getElementsByClassName("provincia")[0];
      const svg = document.getElementsByClassName("mapa-svg")[0];
      provincia.innerText = mapa.provincia;
      svg.innerHTML = mapa.svg;
      // Implementa tu lógica para manejar los datos obtenidos en tu interfaz de usuario
    } else {
      console.error("Error:", response);
      mensajeRojo.style.display = "block";
      setTimeout(() => {
        mensajeAmarillo.style.display = "none";
      }, 4000);
    }
  } catch (error) {
    console.error("Error en la consulta:", error);
  }
}

const generales = document.getElementsByClassName("generales")[0];

function pantallaInicio() {
  mensajeAmarillo.style.display = "block";
  mensajeAmarillo.innerHTML =
    '<p><i class="fa-solid fa-exclamation"></i>  Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR</p>';
  generales.style.visibility = "hidden";
}

pantallaInicio();

function agregarAInforme() {
  const nuevoRegistro = {
    vAnio: selectAnio.value,
    vTipoRecuento: tipoRecuento,
    vTipoEleccion: tipoEleccion,
    vCategoriaId: selectCargo.value,
    vDistrito: selectDistrito.value,
    vSeccionProvincial: hdSeccionProvincial.value,
    vSeccionID: selectSeccion.value,
  };

  const informesExistenteJSON = localStorage.getItem("INFORMES");
  let informesExistente = [];

  if (informesExistenteJSON) {
    informesExistente = JSON.parse(informesExistenteJSON);
  }

  const informesExistenteStrings = informesExistente.map((registro) =>
    JSON.stringify(registro)
  );
  const nuevoRegistroString = JSON.stringify(nuevoRegistro);

  const existeRegistro = informesExistenteStrings.includes(nuevoRegistroString);

  if (existeRegistro) {
    mensajeAmarillo.style.display = "block";
    mensajeAmarillo.innerHTML =
      '<p><i class="fa-solid fa-exclamation"></i>  Registro existente</p>';
    setTimeout(() => {
      mensajeAmarillo.style.display = "none";
    }, 4000);
  } else {
    informesExistente.push(nuevoRegistro);
    localStorage.setItem("INFORMES", JSON.stringify(informesExistente));
    mensajeVerde.style.display = "block";
    setTimeout(() => {
      mensajeVerde.style.display = "none";
    }, 4000);
  }
}

function llenarAgrupacionPolitica() {
  let i = 0;

  const agrupacionHtml = document.getElementsByClassName("agrupaciones")[0];

  agrupacionHtml.innerHTML = "";

  let agrupaciones = dataResponse.valoresTotalizadosPositivos;

  agrupaciones.forEach((agrupacion) => {
    const divAgrupacion = document.createElement("div");

    divAgrupacion.classList.add("agrupacion");

    agrupacionHtml.appendChild(divAgrupacion);

    const nombreAgrupacion = document.createElement("h3");

    nombreAgrupacion.innerText = agrupacion.nombreAgrupacion;

    divAgrupacion.appendChild(nombreAgrupacion);

    const separador = document.createElement("div");
    separador.classList.add("separador");

    divAgrupacion.appendChild(separador);

    const agrupacionTexto = document.createElement("div");
    agrupacionTexto.classList.add("agrupacion-texto");

    divAgrupacion.appendChild(agrupacionTexto);

    const h3 = document.createElement("h3");
    h3.innerText = agrupacion.nombreAgrupacion;

    agrupacionTexto.appendChild(h3);

    const div = document.createElement("div");
    agrupacionTexto.appendChild(div);

    const votosPorcentaje = document.createElement("p");
    votosPorcentaje.innerText = `${agrupacion.votosPorcentaje}%`;

    const votos = document.createElement("p");
    votos.innerText = `${agrupacion.votos} VOTOS`;

    div.appendChild(votosPorcentaje);
    div.appendChild(votos);

    const barra = document.createElement("div");
    barra.classList.add("progress");
    barra.style.backgroundColor = colores[i].colorLiviano;
    divAgrupacion.appendChild(barra);
    barra.innerHTML = `
  <div
    class="progress-bar"
    style="width: ${agrupacion.votosPorcentaje}%; background: ${colores[i].colorPleno}"
  >
    <span class="progress-bar-text">${agrupacion.votosPorcentaje}%</span>
  </div>
`;

    i = i + 1;
  });
}

function llenarResumenVotos() {
  let i = 0;
  let agrupaciones = dataResponse.valoresTotalizadosPositivos;

  let grid = document.getElementsByClassName("grid")[0];

  grid.innerHTML = "";

  agrupaciones.forEach((agrupacion) => {
    if (i < 7) {
      const barra = document.createElement("div");
      barra.classList.add("bar");

      barra.style.setProperty("--bar-value", `${agrupacion.votosPorcentaje}%`);
      barra.style.backgroundColor = colores[i].colorPleno;
      barra.setAttribute("data-name", agrupacion.nombreAgrupacion);
      barra.setAttribute(
        "title",
        `${agrupacion.nombreAgrupacion} ${agrupacion.votosPorcentaje}%`
      );

      grid.appendChild(barra);

      i = i + 1;
    }
  });
  i = 0;
}
