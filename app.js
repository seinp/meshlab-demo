// Portal de casos de MeshLab (maqueta). Una sola app con tres estilos: ?estilo=clinica | rastreo | arcada.
// Todo texto que se ve pasa por t() (textos.js). El estado vive en memoria: al recargar vuelve al principio.
(function () {
  const q = new URLSearchParams(location.search);
  const TEMAS = {
    clinica: { n: 1, nombre: "Clínica blanca", logo: "media/recurso6.png" },
    rastreo: { n: 2, nombre: "Rastreo",        logo: "media/logo.png" },
    arcada:  { n: 3, nombre: "Arcada",         logo: "media/recurso6.png" },
  };
  const ORDEN = Object.keys(TEMAS);
  const estilo = TEMAS[q.get("estilo")] ? q.get("estilo") : "clinica";
  const previa = q.get("vista") === "previa";
  const tema = TEMAS[estilo];
  const E = window.ETAPAS, D = window.DOCTOR;
  const casos = JSON.parse(JSON.stringify(window.CASOS));
  const estado = { pantalla: previa ? "casos" : "login", rol: "doctor", sel: "ML-2431", filtro: "todos" };
  const app = document.getElementById("app");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- utilidades ----------
  const MESES = { ene: "Jan", feb: "Feb", mar: "Mar", abr: "Apr", may: "May", jun: "Jun", jul: "Jul", ago: "Aug", sep: "Sep", oct: "Oct", nov: "Nov", dic: "Dec" };
  const fecha = f => IDIOMA === "en" ? f.replace(/(\d+) (\w+)/, (_, d, m) => `${MESES[m] || m} ${+d}`) : f;
  const ARC = { Superior: "Arcada superior", Inferior: "Arcada inferior", Ambas: "Ambas arcadas" };
  const paciente = c => `${t("Paciente")} ${c.pac} · ${c.edad} ${t("años")}`;
  const etiqueta = c => c.falta ? t("Faltan archivos") : t(E[c.etapa].nombre);
  const nota = c => c.falta ? `${t("Nos falta este archivo para empezar la planeación:")} ${t(c.falta)}.` : t(c.nota || NOTAS[c.etapa]);
  const clase = (k, c) => k < c.etapa ? "hecho" : k === c.etapa ? "ahora" : "";
  const buscar = cod => casos.find(c => c.cod === cod);
  const mios = () => casos.filter(c => c.doc === D.nombre);

  function aviso(txt) {
    const a = document.createElement("div");
    a.className = "aviso-flotante"; a.textContent = txt;
    document.body.appendChild(a);
    setTimeout(() => a.classList.add("sale"), 2600);
    setTimeout(() => a.remove(), 3100);
  }
  function modal(html) {
    cerrarModal();
    document.body.insertAdjacentHTML("beforeend", `<div class="modal"><div class="caja">${html}</div></div>`);
  }
  function cerrarModal() { document.querySelector(".modal")?.remove(); }
  function pedirArchivo(accept, multiple, cb) {
    const inp = document.getElementById("archivo");
    inp.accept = accept; inp.multiple = multiple; inp.value = "";
    inp.onchange = () => inp.files.length && cb([...inp.files]);
    inp.click();
  }

  // ---------- rutas (cambian por estilo) ----------
  const RUTAS = {
    clinica(n, c) {
      n.innerHTML = `<div class="pasos"><span class="llena" style="--p:${c.etapa / 6}"></span>${E.map((e, k) =>
        `<div class="p ${clase(k, c)}"><i></i>${t(e.corto)}</div>`).join("")}</div>`;
    },
    rastreo(n, c) {
      n.innerHTML = `<div class="carretera" style="--p:${c.etapa / 6}"><span class="hecha"></span><span class="caja">${c.etapa >= 5 ? "🛵" : "🦷"}</span></div>
        <div class="eventos">${E.map((e, k) => `<div class="ev ${clase(k, c)}"><b>${t(e.corto)}</b><small>${
          k < c.etapa ? "✓ " + t("Listo") : k === c.etapa ? t("Ahora") : t("Pendiente")}</small></div>`).join("")}</div>`;
    },
    arcada(n, c) {
      const d = "M40 20 C 40 250, 580 250, 580 20";
      n.innerHTML = `<svg class="arco" viewBox="0 -10 620 260"><defs><linearGradient id="grad"><stop offset="0" stop-color="#36c2d9"/><stop offset="1" stop-color="#1976d2"/></linearGradient></defs>
        <path class="base" d="${d}"/><path class="hecho" d="${d}"/><g class="dientes"></g></svg>`;
      const p = n.querySelector(".hecho"), L = p.getTotalLength(), g = n.querySelector(".dientes");
      E.forEach((e, k) => {
        const pt = p.getPointAtLength(L * k / 6), abajo = pt.y > 120;
        const tx = abajo ? pt.x : pt.x + (pt.x < 310 ? 64 : -64), ty = abajo ? pt.y + 44 : pt.y + 5;
        g.insertAdjacentHTML("beforeend", `<g class="diente ${k < c.etapa ? "ok" : k === c.etapa ? "ya" : ""}">
          <rect x="${pt.x - 17}" y="${pt.y - 20}" width="34" height="40" rx="12"/>
          <text class="n" x="${pt.x}" y="${pt.y + 5}">${k < c.etapa ? "✓" : k + 1}</text>
          <text class="e" x="${tx}" y="${ty}">${esc(t(e.corto))}</text></g>`);
      });
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      setTimeout(() => { p.style.strokeDashoffset = L * (1 - c.etapa / 6); }, 40);
    },
  };

  // ---------- piezas comunes ----------
  function cabecera() {
    const doc = estado.rol === "doctor";
    const links = doc
      ? `<a data-ir="casos" class="${estado.pantalla === "casos" ? "on" : ""}">${t("Mis casos")}</a><a data-ir="nuevo" class="${estado.pantalla === "nuevo" ? "on" : ""}">${t("Nuevo caso")}</a>`
      : `<a class="on">${t("Panel del laboratorio")}</a>`;
    return `<header class="barra">
      <img class="logo" src="${tema.logo}" alt="MeshLab 3D Studio">
      <nav class="menu">${links}</nav>
      <div class="doc"><b>${doc ? D.nombre : "MeshLab 3D Studio"}</b><span>${doc ? D.clinica : t("Laboratorio")}</span></div>
      ${previa ? "" : `<button class="salir" data-ir="login" title="${t("Salir")}">⏻</button>`}
    </header>`;
  }

  // ---------- pantallas ----------
  const PANTALLAS = {
    login() {
      return `<section class="login">
        <div class="login-foto"><img src="media/srth.png" alt="">
          <div class="login-lema"><h2>${t("Tus casos, paso a paso.")}</h2><p>${t("Sube los archivos, aprueba la simulación y sigue cada caso hasta que llegue a tu clínica.")}</p></div>
        </div>
        <form class="login-caja" onsubmit="return false">
          <img class="logo" src="${estilo === "rastreo" ? "media/recurso6.png" : tema.logo}" alt="MeshLab 3D Studio">
          <h1>${t("Ingresa a tu portal")}</h1>
          <label>${t("Correo")}<input type="email" value="${D.correo}" autocomplete="off"></label>
          <label>${t("Contraseña")}<input type="password" value="maqueta" autocomplete="off"></label>
          <button class="cta" data-acc="entrar">${t("Entrar")}</button>
          <a class="olvide">${t("¿Olvidaste tu contraseña?")}</a>
          <div class="separador"><span>${t("o")}</span></div>
          <button class="cta sec" data-acc="entrar-lab">${t("Entrar como laboratorio")}</button>
          <p class="pista">${t("Maqueta con datos de ejemplo: toca Entrar.")}</p>
        </form>
      </section>`;
    },

    casos() {
      const lista = mios();
      if (!buscar(estado.sel) || buscar(estado.sel).doc !== D.nombre) estado.sel = lista[0].cod;
      const activos = lista.filter(c => c.etapa < 6).length, porAprobar = lista.filter(c => c.etapa === 2 && !c.falta).length, faltan = lista.filter(c => c.falta).length;
      return cabecera() + `
        <section class="resumen">
          <div><b>${activos}</b><span>${t("casos activos")}</span></div>
          <div class="alerta"><b>${porAprobar}</b><span>${t("por aprobar")}</span></div>
          <div class="falta"><b>${faltan}</b><span>${t("faltan archivos")}</span></div>
          <button class="nuevo" data-ir="nuevo">+ ${t("Nuevo caso")}</button>
        </section>
        <main class="app">
          <aside class="lista">${lista.map((c, i) => `
            <button class="caso${c.falta ? " con-falta" : ""}${c.etapa === 2 && !c.falta ? " por-aprobar" : ""}${c.cod === estado.sel ? " on" : ""}" data-sel="${c.cod}" style="--n:${i}">
              <span class="cod">${c.cod}</span>
              <span class="pac">${paciente(c)}</span>
              <span class="estado">${etiqueta(c)}</span>
              <span class="mini"><i style="--p:${(c.etapa + 1) / E.length}"></i></span>
            </button>`).join("")}
          </aside>
          <section class="detalle"></section>
        </main>`;
    },

    nuevo() {
      estado.form = { fotos: 0, pdf: 0, stl: 0 };
      const cod = "ML-" + (Math.max(...casos.map(c => +c.cod.slice(3))) + 1);
      estado.nuevoCod = cod;
      const zona = (id, icono, titulo, txt, accept) => `
        <button class="zona" data-zona="${id}" data-accept="${accept}"><i>${icono}</i><b>${t(titulo)}</b><small>${t(txt)}</small><span class="carga"><i></i></span><em></em></button>`;
      return cabecera() + `
        <form class="formulario" onsubmit="return false">
          <div class="form-cabeza"><span class="cod">${cod}</span><h1>${t("Nuevo caso")}</h1><p>${t("Llena los datos, sube los archivos y envíalo. Te avisamos cada vez que cambie de etapa.")}</p></div>
          <div class="bloques">
            <div class="bloque"><h2><span>1</span>${t("Paciente")}</h2>
              <label>${t("Iniciales")}<input name="pac" maxlength="6" placeholder="${t("Ej.: J.P.")}"></label>
              <label>${t("Edad")}<input name="edad" type="number" min="6" max="99" placeholder="${t("Ej.: 25")}"></label>
              <p class="pista">🔒 ${t("Por privacidad usamos iniciales y un código, no el nombre completo.")}</p>
            </div>
            <div class="bloque"><h2><span>2</span>${t("Tratamiento")}</h2>
              <label>${t("Tipo")}<select name="tipo">${TRATAMIENTOS.map(x => `<option value="${x}">${t(x)}</option>`).join("")}</select></label>
              <div class="grupo"><span>${t("Arcadas")}</span><div class="chips">${ARCADAS.map((a, i) =>
                `<label class="chip"><input type="radio" name="arcada" value="${a}"${i === 2 ? " checked" : ""}><span>${t(a)}</span></label>`).join("")}</div></div>
              <label>${t("Indicaciones")}<textarea name="ind" rows="4" placeholder="${t("Ej.: cerrar el diastema superior, no mover molares…")}"></textarea></label>
            </div>
            <div class="bloque"><h2><span>3</span>${t("Archivos")}</h2>
              ${zona("fotos", "📸", "Fotos", "Intraorales y extraorales · JPG o PNG", "image/*")}
              ${zona("pdf", "📄", "Radiografías", "Panorámica y cefálica · PDF", ".pdf,application/pdf")}
              ${zona("stl", "🦷", "Escaneo 3D", "Arcada superior e inferior · STL", ".stl")}
              <a class="ejemplo" data-acc="ejemplo">${t("Usar archivos de ejemplo")}</a>
              <p class="pista">${t("En esta maqueta los archivos no salen de tu equipo.")}</p>
            </div>
          </div>
          <label class="autoriza"><input type="checkbox" name="ok"> <span>${t("El paciente autorizó el tratamiento de sus datos personales (Ley 1581 de 2012).")}</span></label>
          <div class="acciones"><button class="cta" data-acc="enviar-caso">${t("Enviar caso")}</button><button class="cta sec" data-ir="casos">${t("Cancelar")}</button></div>
        </form>`;
    },

    lab() {
      const cuenta = k => casos.filter(c => k === "faltan" ? c.falta : k === "todos" ? true : !c.falta && c.etapa === k).length;
      const f = estado.filtro;
      const filas = casos.filter(c => f === "todos" ? true : f === "faltan" ? c.falta : !c.falta && c.etapa === f);
      const chip = (k, txt) => `<button class="filtro${f === k ? " on" : ""}" data-filtro="${k}">${txt} <b>${cuenta(k)}</b></button>`;
      return cabecera() + `
        <section class="lab">
          <div class="lab-cabeza"><h1>${t("Panel del laboratorio")}</h1><p>${t("Mueve cada caso de etapa. El doctor lo ve al instante y le llega un correo.")}</p></div>
          <div class="filtros">${chip("todos", t("Todos"))}${E.map((e, k) => chip(k, t(e.corto))).join("")}${chip("faltan", t("Faltan archivos"))}</div>
          <div class="tabla">
            <div class="fila titulos"><span>${t("Caso")}</span><span>${t("Doctor")}</span><span>${t("Tratamiento")}</span><span>${t("Creado")}</span><span>${t("Etapa")}</span><span></span></div>
            ${filas.map((c, i) => `<div class="fila${c.falta ? " con-falta" : ""}" style="--n:${i}">
              <span class="cod">${c.cod}<small>${c.pac} · ${c.edad} ${t("años")}</small></span>
              <span>${c.doc}</span><span>${t(c.tipo)}<small>${t(ARC[c.arcada])}</small></span><span>${fecha(c.fecha)}</span>
              <span><select data-etapa="${c.cod}">${E.map((e, k) => `<option value="${k}"${k === c.etapa ? " selected" : ""}>${t(e.nombre)}</option>`).join("")}</select></span>
              <span><button class="mini-btn" data-acc="faltan" data-cod="${c.cod}">${c.falta ? "✓ " + t("Ya llegó") : t("Pedir archivo")}</button></span>
            </div>`).join("") || `<p class="vacio">${t("No hay casos en esta etapa.")}</p>`}
          </div>
        </section>`;
    },
  };

  function pintarDetalle() {
    const c = buscar(estado.sel), det = app.querySelector(".detalle");
    if (!det || !c) return;
    const botones = c.falta
      ? `<button class="cta" data-acc="subir-falta">${t("Subir")} ${t(c.falta).toLowerCase()}</button>`
      : c.etapa === 2
        ? `<button class="cta" data-acc="simulacion">${t("Ver simulación")}</button><button class="cta sec" data-acc="aprobar">${t("Aprobar")}</button><button class="cta sec" data-acc="cambios">${t("Pedir cambios")}</button>`
        : `<button class="cta sec" data-acc="archivos">${t("Ver archivos")}</button><button class="cta sec" data-acc="mensaje">${t("Escribir al laboratorio")}</button>`;
    det.innerHTML = `
      <div class="cabeza">
        <div><span class="cod">${c.cod}</span><h1>${paciente(c)}</h1>
          <p class="tipo">${t(c.tipo)} · ${t(ARC[c.arcada])} · ${t("creado el")} ${fecha(c.fecha)}${c.alineadores ? ` · ${c.alineadores} ${t("alineadores")}` : ""}</p></div>
        <span class="sello">${etiqueta(c)}</span>
      </div>
      <div class="ruta"></div>
      <p class="nota${c.falta ? " aviso" : ""}">${esc(nota(c))}</p>
      <div class="archivos">
        <span>📸 ${c.archivos.fotos} ${t("fotos")}</span><span class="${c.archivos.pdf ? "" : "no"}">📄 ${c.archivos.pdf} ${t("radiografía")}</span><span>🦷 ${c.archivos.stl} STL</span>
      </div>
      <div class="acciones">${botones}</div>`;
    det.classList.remove("entra"); void det.offsetWidth; det.classList.add("entra");
    RUTAS[estilo](det.querySelector(".ruta"), c);
  }

  function pintar() {
    app.className = "pantalla-" + estado.pantalla;
    app.innerHTML = PANTALLAS[estado.pantalla]();
    if (estado.pantalla === "casos") pintarDetalle();
  }
  function ir(p) { estado.pantalla = p; pintar(); window.scrollTo(0, 0); }

  // ---------- acciones ----------
  function subirZona(zona, n) {
    const id = zona.dataset.zona;
    zona.classList.remove("lista"); zona.classList.add("cargando");
    setTimeout(() => {
      zona.classList.remove("cargando"); zona.classList.add("lista");
      estado.form[id] = n;
      zona.querySelector("em").textContent = `✓ ${n} ${t(n === 1 ? "archivo" : "archivos")}`;
    }, 1300);
  }

  const ACCIONES = {
    entrar() { estado.rol = "doctor"; ir("casos"); },
    "entrar-lab"() { estado.rol = "lab"; ir("lab"); },
    simulacion() {
      const c = buscar(estado.sel);
      modal(`<header><b>${t("Simulación")} · ${c.cod}</b><button data-cerrar>✕</button></header>
        <div class="visor"><img src="media/alineador.png" alt=""><div><b>${t("Visor web de Maestro 3D")}</b><p>${t("Aquí se abre la simulación que el laboratorio comparte por link. Se ve en el computador, la tableta o el celular.")}</p><span class="pildora">${c.alineadores} ${t("alineadores")} · ${t(ARC[c.arcada])}</span></div></div>
        <footer><button class="cta" data-acc="aprobar">${t("Aprobar")}</button><button class="cta sec" data-acc="cambios">${t("Pedir cambios")}</button></footer>`);
    },
    aprobar() {
      const c = buscar(estado.sel); c.etapa = 3; c.nota = null; cerrarModal(); pintar();
      aviso(`${c.cod}: ${t("simulación aprobada. Pasa a fabricación.")}`);
    },
    cambios() {
      modal(`<header><b>${t("Pedir cambios")}</b><button data-cerrar>✕</button></header>
        <label class="campo">${t("¿Qué quieres cambiar?")}<textarea rows="4" placeholder="${t("Ej.: menos expansión en la arcada superior.")}"></textarea></label>
        <footer><button class="cta" data-acc="enviar-cambios">${t("Enviar al laboratorio")}</button><button class="cta sec" data-cerrar>${t("Cancelar")}</button></footer>`);
    },
    "enviar-cambios"() {
      const c = buscar(estado.sel); c.etapa = 1;
      c.nota = "Recibimos tus comentarios. Ajustamos la planeación y te enviamos una nueva simulación.";
      cerrarModal(); pintar(); aviso(t("Comentarios enviados al laboratorio."));
    },
    "subir-falta"() {
      pedirArchivo(".pdf,application/pdf", false, () => {
        const c = buscar(estado.sel); c.falta = null; c.archivos.pdf = 1; c.etapa = 1; pintar();
        aviso(`${c.cod}: ${t("radiografía recibida. Empezamos la planeación.")}`);
      });
    },
    archivos() {
      const c = buscar(estado.sel);
      const fila = (i, n, p) => `<li><i>${i}</i><span>${n}</span><small>${p}</small></li>`;
      modal(`<header><b>${t("Archivos")} · ${c.cod}</b><button data-cerrar>✕</button></header>
        <ul class="lista-archivos">${Array.from({ length: c.archivos.fotos }, (_, k) => fila("📸", `foto_${String(k + 1).padStart(2, "0")}.jpg`, "2,4 MB")).join("")}
        ${c.archivos.pdf ? fila("📄", "radiografia_panoramica.pdf", "1,1 MB") : ""}${fila("🦷", "arcada_superior.stl", "38 MB")}${fila("🦷", "arcada_inferior.stl", "35 MB")}</ul>`);
    },
    mensaje() {
      modal(`<header><b>${t("Escribir al laboratorio")}</b><button data-cerrar>✕</button></header>
        <label class="campo">${t("Mensaje")}<textarea rows="4" placeholder="${t("Escribe tu duda sobre este caso…")}"></textarea></label>
        <footer><button class="cta" data-acc="enviar-mensaje">${t("Enviar")}</button><button class="cta sec" data-cerrar>${t("Cancelar")}</button></footer>`);
    },
    "enviar-mensaje"() { cerrarModal(); aviso(t("Mensaje enviado. Te respondemos por aquí y por correo.")); },
    ejemplo() {
      app.querySelectorAll(".zona").forEach((z, i) => setTimeout(() => subirZona(z, [8, 1, 2][i]), i * 250));
      const f = app.querySelector(".formulario");
      if (!f.pac.value) f.pac.value = "J.P."; if (!f.edad.value) f.edad.value = 25;
      f.ok.checked = true;
    },
    "enviar-caso"() {
      const f = app.querySelector(".formulario"), s = estado.form, falta = [];
      if (!f.pac.value.trim()) falta.push(t("iniciales")); if (!f.edad.value) falta.push(t("edad"));
      if (!s.fotos) falta.push(t("fotos")); if (!s.pdf) falta.push(t("radiografías")); if (!s.stl) falta.push(t("escaneo 3D"));
      if (!f.ok.checked) falta.push(t("autorización de datos"));
      if (falta.length) return aviso(`${t("Falta:")} ${falta.join(", ")}`);
      const c = { cod: estado.nuevoCod, doc: D.nombre, pac: esc(f.pac.value.trim().toUpperCase()), edad: +f.edad.value, tipo: f.tipo.value,
        arcada: f.querySelector("[name=arcada]:checked").value, etapa: 0, fecha: "30 sep", alineadores: null, archivos: { fotos: s.fotos, pdf: s.pdf, stl: s.stl } };
      casos.unshift(c); estado.sel = c.cod; ir("casos");
      aviso(`${c.cod}: ${t("caso enviado. Te avisamos cuando empiece la planeación.")}`);
    },
    faltan(b) {
      const c = buscar(b.dataset.cod);
      c.falta = c.falta ? null : "Radiografía panorámica";
      if (!c.falta) c.archivos.pdf = 1; else c.archivos.pdf = 0;
      pintar(); aviso(c.falta ? `${c.cod}: ${t("le pedimos el archivo al doctor.")}` : `${c.cod}: ${t("archivo recibido.")}`);
    },
  };

  document.addEventListener("click", e => {
    const irA = e.target.closest("[data-ir]"); if (irA) { if (irA.dataset.ir === "login") estado.rol = "doctor"; return ir(irA.dataset.ir); }
    const sel = e.target.closest("[data-sel]");
    if (sel) { estado.sel = sel.dataset.sel; app.querySelectorAll(".caso").forEach(b => b.classList.toggle("on", b === sel)); pintarDetalle();
      if (innerWidth < 761) app.querySelector(".detalle").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const acc = e.target.closest("[data-acc]"); if (acc) { e.preventDefault(); return ACCIONES[acc.dataset.acc](acc); }
    const zona = e.target.closest(".zona"); if (zona) return pedirArchivo(zona.dataset.accept, true, fs => subirZona(zona, fs.length));
    const filtro = e.target.closest("[data-filtro]"); if (filtro) { const v = filtro.dataset.filtro; estado.filtro = isNaN(v) ? v : +v; return pintar(); }
    if (e.target.closest("[data-cerrar]") || e.target.classList.contains("modal")) cerrarModal();
  });
  document.addEventListener("change", e => {
    const s = e.target.closest("[data-etapa]"); if (!s) return;
    const c = buscar(s.dataset.etapa); c.etapa = +s.value; c.nota = null;
    if (c.etapa >= 2 && !c.alineadores) c.alineadores = 20;
    aviso(`${c.cod} → ${t(E[c.etapa].nombre)}. ${t("Le avisamos al doctor por correo.")}`);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarModal(); });

  // ---------- barra de la propuesta (volver / siguiente / idioma) ----------
  const lang = IDIOMA === "en" ? "&lang=en" : "";
  if (!previa) {
    const sig = ORDEN[(ORDEN.indexOf(estilo) + 1) % ORDEN.length];
    document.body.insertAdjacentHTML("afterbegin", `<div class="propuesta">
      <a class="volver" href="index.html${lang ? "?" + lang.slice(1) : ""}">← <span>${t("Ver las 3 opciones")}</span></a>
      <span class="cual">${t("Opción")} ${tema.n} ${t("de")} 3 · <b>${t(tema.nombre)}</b></span>
      <a class="sig" href="portal.html?estilo=${sig}${lang}"><span>${t("Siguiente opción")}</span> →</a>
      <button class="idioma" data-idioma>${IDIOMA === "en" ? "ES" : "EN"}</button>
    </div>`);
    document.querySelector("[data-idioma]").onclick = () => cambiarIdioma(IDIOMA === "en" ? "es" : "en");
  } else {
    document.documentElement.classList.add("previa");
  }
  document.title = `${t("Portal de casos")} · ${t(tema.nombre)} · MeshLab 3D Studio`;
  pintar();
})();
