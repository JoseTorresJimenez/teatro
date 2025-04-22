const filas = 6;
const columnas = 10;
const asientos = [];
let id = 1;

for (let i = 0; i < filas; i++) {
  let fila = [];
  for (let j = 0; j < columnas; j++) {
    fila.push({ id: id++, estado: false });
  }
  asientos.push(fila);
}

function renderizarAsientos(seleccionados = new Set()) {
  const contenedor = document.getElementById("seat-map");
  contenedor.innerHTML = "";

  asientos.forEach(fila => {
    fila.forEach(asiento => {
      const div = document.createElement("div");
      div.className = "seat";

      if (asiento.estado) {
        div.classList.add("occupied");
      } else if (seleccionados.has(asiento.id)) {
        div.classList.add("selected");
      }

      div.title = "Asiento #" + asiento.id;
      contenedor.appendChild(div);
    });
    contenedor.appendChild(document.createElement("br"));
  });
}

function sugerirAsientos() {
  const cantidad = parseInt(document.getElementById("numSeats").value);
  if (cantidad <= 0 || cantidad > columnas) {
    mostrarNotificacion("Cantidad inválida. Máximo permitido: " + columnas);
    renderizarAsientos();
    return;
  }  

  let centro = Math.floor(filas / 2);
  let ordenFilas = [];

  for (let i = 0; i < filas; i++) {
    let arriba = centro - i;
    let abajo = centro + i;

    if (arriba >= 0) ordenFilas.push(arriba);
    if (abajo < filas && abajo !== arriba) ordenFilas.push(abajo);
  }

  for (let filaIndex of ordenFilas) {
    let fila = asientos[filaIndex];

    for (let i = 0; i <= columnas - cantidad; i++) {
      let disponibles = true;

      for (let j = 0; j < cantidad; j++) {
        if (fila[i + j].estado) {
          disponibles = false;
          break;
        }
      }

      if (disponibles) {
        let seleccion = new Set();

        for (let j = 0; j < cantidad; j++) {
          fila[i + j].estado = true;
          seleccion.add(fila[i + j].id);
        }

        renderizarAsientos(seleccion);
        return seleccion;
      }
    }
  }

  mostrarNotificacion("No hay suficientes asientos disponibles juntos.");
  renderizarAsientos();
  return new Set();
}

renderizarAsientos();

function mostrarNotificacion(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.classList.add("show");
  
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }