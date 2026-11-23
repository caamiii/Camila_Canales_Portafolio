/* Interacciones */

/* 1. Efecto alas. */
document.querySelectorAll(".alas").forEach(function (zona) {
  zona.addEventListener("pointermove", function (evento) {
    var caja = zona.getBoundingClientRect();
    var x = ((evento.clientX - caja.left) / caja.width) * 100;
    var y = ((evento.clientY - caja.top) / caja.height) * 100;
    zona.style.setProperty("--x", x.toFixed(1) + "%");
    zona.style.setProperty("--y", y.toFixed(1) + "%");
  });
});

/* 2. Menú "Trabajos". */
var botonTrabajos = document.querySelector(".menu__item--trabajos > .menu__enlace");
if (botonTrabajos) {
  var itemTrabajos = botonTrabajos.parentElement;
  botonTrabajos.addEventListener("click", function () {
    var abierto = itemTrabajos.classList.toggle("abierto");
    botonTrabajos.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  document.addEventListener("click", function (evento) {
    if (!itemTrabajos.contains(evento.target)) {
      itemTrabajos.classList.remove("abierto");
      botonTrabajos.setAttribute("aria-expanded", "false");
    }
  });
}

/* 3. Tarjeta de contacto */
var tarjeta = document.getElementById("contacto");
if (tarjeta) {
  document.querySelectorAll("[data-abrir-contacto]").forEach(function (boton) {
    boton.addEventListener("click", function () { tarjeta.showModal(); });
  });
  tarjeta.querySelector("[data-cerrar-contacto]").addEventListener("click", function () {
    tarjeta.close();
  });
  // Cerrar al hacer clic fuera de la tarjeta
  tarjeta.addEventListener("click", function (evento) {
    if (evento.target === tarjeta) { tarjeta.close(); }
  });
}

/* 4. Contactos copiables al hacer clic y muestran "¡copiado!" por un momento. */
function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(texto).catch(function () { return copiarAlternativo(texto); });
  }
  return copiarAlternativo(texto);
}

// Alternativa para navegadores sin acceso al portapapeles 
function copiarAlternativo(texto) {
  var campo = document.createElement("textarea");
  campo.value = texto;
  campo.setAttribute("readonly", "");
  campo.className = "visualmente-oculto";
  document.body.appendChild(campo);
  campo.select();
  document.execCommand("copy");
  document.body.removeChild(campo);
  return Promise.resolve();
}

document.querySelectorAll("[data-copiar]").forEach(function (elemento) {
  elemento.addEventListener("click", function () {
    // En el ícono de Instagram de la portada además se abre el perfil.
    copiarTexto(elemento.dataset.copiar).then(function () {
      elemento.setAttribute("data-copiado", "");
      setTimeout(function () { elemento.removeAttribute("data-copiado"); }, 1800);
    });
  });
});

/* 5. Rueda "Sigue explorando". */
document.querySelectorAll("[data-rueda]").forEach(function (rueda) {
  var lista = rueda;   // el <ul> es a la vez la rueda y la lista
  var pausada = false;
  var reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  rueda.addEventListener("mouseenter", function () { pausada = true; });
  rueda.addEventListener("mouseleave", function () { pausada = false; });
  rueda.addEventListener("focusin", function () { pausada = true; });
  rueda.addEventListener("focusout", function () { pausada = false; });

  function girar() {
    if (pausada || reducirMovimiento) { return; }
    var items = Array.prototype.slice.call(lista.children);
    var antes = items.map(function (item) { return item.getBoundingClientRect().top; });

    lista.appendChild(items[0]); // el primero pasa al final

    // Animación FLIP: cada nombre se desliza desde donde estaba
    items.forEach(function (item, i) {
      var delta = antes[i] - item.getBoundingClientRect().top;
      item.animate(
        [{ transform: "translateY(" + delta + "px)" }, { transform: "translateY(0)" }],
        { duration: 700, easing: "cubic-bezier(0.5, 0, 0.2, 1)" }
      );
    });
  }

  setInterval(girar, 2600);
});

/* 6. Videos de los proyectos. */
var videosDiferidos = document.querySelectorAll("video[data-video-diferido]");
if ("IntersectionObserver" in window) {
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      var video = entrada.target;
      if (entrada.isIntersecting) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: "200px 0px" });
  videosDiferidos.forEach(function (video) { observador.observe(video); });
} else {
  videosDiferidos.forEach(function (video) { video.play(); });
}
