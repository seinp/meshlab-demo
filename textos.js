// Idioma de la maqueta. La clave ES el texto en español; t() devuelve el ingles si IDIOMA === "en".
// Elementos estaticos: data-t="texto en español". En consola avisa lo que falte traducir.
(function () {
  const q = new URLSearchParams(location.search);
  let guardado = null;
  try { guardado = localStorage.getItem("meshlab-idioma"); } catch (e) {}
  window.IDIOMA = q.get("lang") === "en" || q.get("lang") === "es" ? q.get("lang") : guardado === "en" ? "en" : "es";

  const EN = {
    // etapas
    "Recibido": "Received", "En planeación": "In planning", "Simulación lista": "Simulation ready", "Aprobado": "Approved",
    "En fabricación": "In production", "En ruta con mensajero": "Out for delivery", "Entregado": "Delivered",
    "Planeación": "Planning", "Simulación": "Simulation", "Fabricación": "Production", "En ruta": "On the way",
    // notas del laboratorio
    "Recibimos tu caso. Revisamos los archivos y empezamos la planeación.": "We got your case. We're checking the files and starting the plan.",
    "Nuestro equipo está planeando el tratamiento. Te avisamos al tener la simulación.": "Our team is planning the treatment. We'll let you know when the simulation is ready.",
    "La simulación está lista. Revísala y apruébala para pasar a fabricación.": "The simulation is ready. Review and approve it to move to production.",
    "Aprobaste la simulación. Pasamos el caso a fabricación.": "You approved the simulation. The case is moving to production.",
    "Imprimiendo los modelos y termoformando los alineadores.": "Printing the models and thermoforming the aligners.",
    "El mensajero va en camino. Entrega estimada hoy antes de las 5:00 p. m.": "The courier is on the way. Estimated delivery today before 5:00 p.m.",
    "Entregado en tu clínica. ¡Gracias por confiar en MeshLab!": "Delivered to your clinic. Thanks for trusting MeshLab!",
    "Recibimos tus comentarios. Ajustamos la planeación y te enviamos una nueva simulación.": "We got your comments. We'll adjust the plan and send you a new simulation.",
    // tratamientos y arcadas
    "Alineadores": "Aligners", "Alineadores de finalización": "Finishing aligners", "Retenedores activos": "Active retainers", "Retenedores pasivos": "Passive retainers",
    "Superior": "Upper", "Inferior": "Lower", "Ambas": "Both",
    "Arcada superior": "Upper arch", "Arcada inferior": "Lower arch", "Ambas arcadas": "Both arches",
    "Radiografía panorámica": "Panoramic X-ray",
    // estilos
    "Clínica blanca": "Clean clinic", "Rastreo": "Tracking", "Arcada": "Dental arch",
    // comunes
    "Paciente": "Patient", "años": "y/o", "Faltan archivos": "Missing files",
    "Nos falta este archivo para empezar la planeación:": "We need this file to start planning:",
    "Listo": "Done", "Ahora": "Now", "Pendiente": "Pending",
    "Mis casos": "My cases", "Nuevo caso": "New case", "Panel del laboratorio": "Lab dashboard", "Laboratorio": "Lab", "Salir": "Log out",
    // login
    "Tus casos, paso a paso.": "Your cases, step by step.",
    "Sube los archivos, aprueba la simulación y sigue cada caso hasta que llegue a tu clínica.": "Upload the files, approve the simulation and follow every case until it reaches your clinic.",
    "Ingresa a tu portal": "Sign in to your portal", "Correo": "Email", "Contraseña": "Password", "Entrar": "Sign in",
    "¿Olvidaste tu contraseña?": "Forgot your password?", "o": "or", "Entrar como laboratorio": "Sign in as the lab",
    "Maqueta con datos de ejemplo: toca Entrar.": "Mockup with sample data: just tap Sign in.",
    // mis casos
    "casos activos": "active cases", "por aprobar": "to approve", "faltan archivos": "missing files",
    // nuevo caso
    "Llena los datos, sube los archivos y envíalo. Te avisamos cada vez que cambie de etapa.": "Fill in the details, upload the files and send it. We'll let you know every time it changes stage.",
    "Iniciales": "Initials", "Ej.: J.P.": "E.g. J.P.", "Edad": "Age", "Ej.: 25": "E.g. 25",
    "Por privacidad usamos iniciales y un código, no el nombre completo.": "For privacy we use initials and a code, never the full name.",
    "Tratamiento": "Treatment", "Tipo": "Type", "Arcadas": "Arches", "Indicaciones": "Instructions",
    "Ej.: cerrar el diastema superior, no mover molares…": "E.g. close the upper diastema, don't move the molars…",
    "Archivos": "Files", "Fotos": "Photos", "Intraorales y extraorales · JPG o PNG": "Intraoral and extraoral · JPG or PNG",
    "Radiografías": "X-rays", "Panorámica y cefálica · PDF": "Panoramic and cephalometric · PDF",
    "Escaneo 3D": "3D scan", "Arcada superior e inferior · STL": "Upper and lower arch · STL",
    "Usar archivos de ejemplo": "Use sample files", "En esta maqueta los archivos no salen de tu equipo.": "In this mockup your files never leave your device.",
    "El paciente autorizó el tratamiento de sus datos personales (Ley 1581 de 2012).": "The patient authorized the processing of their personal data (Colombian Law 1581 of 2012).",
    "Enviar caso": "Send case", "Cancelar": "Cancel",
    // laboratorio
    "Mueve cada caso de etapa. El doctor lo ve al instante y le llega un correo.": "Move each case to its next stage. The doctor sees it right away and gets an email.",
    "Todos": "All", "Caso": "Case", "Doctor": "Doctor", "Creado": "Created", "Etapa": "Stage",
    "Ya llegó": "Received", "Pedir archivo": "Request file", "No hay casos en esta etapa.": "No cases in this stage.",
    // detalle
    "Subir": "Upload", "Ver simulación": "View simulation", "Aprobar": "Approve", "Pedir cambios": "Request changes",
    "Ver archivos": "View files", "Escribir al laboratorio": "Message the lab", "creado el": "created", "alineadores": "aligners",
    "fotos": "photos", "radiografía": "X-ray",
    // ventanas y avisos
    "Visor web de Maestro 3D": "Maestro 3D web viewer",
    "Aquí se abre la simulación que el laboratorio comparte por link. Se ve en el computador, la tableta o el celular.": "The simulation the lab shares by link opens here. It works on a computer, tablet or phone.",
    "simulación aprobada. Pasa a fabricación.": "simulation approved. Moving to production.",
    "¿Qué quieres cambiar?": "What would you like to change?", "Ej.: menos expansión en la arcada superior.": "E.g. less expansion on the upper arch.",
    "Enviar al laboratorio": "Send to the lab", "Comentarios enviados al laboratorio.": "Comments sent to the lab.",
    "radiografía recibida. Empezamos la planeación.": "X-ray received. We're starting the plan.",
    "Mensaje": "Message", "Escribe tu duda sobre este caso…": "Write your question about this case…", "Enviar": "Send",
    "Mensaje enviado. Te respondemos por aquí y por correo.": "Message sent. We'll reply here and by email.",
    "archivo": "file", "archivos": "files", "iniciales": "initials", "edad": "age", "radiografías": "X-rays",
    "escaneo 3D": "3D scan", "autorización de datos": "data authorization", "Falta:": "Missing:",
    "caso enviado. Te avisamos cuando empiece la planeación.": "case sent. We'll let you know when planning starts.",
    "le pedimos el archivo al doctor.": "we asked the doctor for the file.", "archivo recibido.": "file received.",
    "Le avisamos al doctor por correo.": "We emailed the doctor.",
    // barra de la propuesta
    "Ver las 3 opciones": "See the 3 options", "Opción": "Option", "de": "of", "Siguiente opción": "Next option", "Portal de casos": "Case portal",
    // portada (index.html)
    "Propuesta para MeshLab 3D Studio": "Proposal for MeshLab 3D Studio",
    "Tu portal de casos, en tres estilos.": "Your case portal, in three styles.",
    "Toca una opción y recórrela como si fueras un doctor: entra, crea un caso, aprueba la simulación y síguelo hasta la entrega. Después vuelve y mira la siguiente.": "Tap an option and try it as if you were a doctor: sign in, create a case, approve the simulation and follow it to delivery. Then come back and look at the next one.",
    "Limpio y luminoso, como una app de salud. La barra de progreso dice en qué va cada caso.": "Clean and bright, like a health app. The progress bar shows where each case stands.",
    "Como rastrear un envío: el caso viaja por la ruta y cada etapa queda marcada.": "Like tracking a package: the case travels along the route and every stage is checked off.",
    "Las etapas son dientes sobre una arcada: el ortodoncista entiende el avance de un vistazo.": "The stages are teeth on a dental arch: the orthodontist gets the progress at a glance.",
    "Ver esta opción": "See this option",
    "Qué puedes probar en cada una": "What you can try in each one",
    "Entrar como doctor": "Sign in as a doctor", "Crear un caso y subir archivos": "Create a case and upload files",
    "Ver y aprobar la simulación": "View and approve the simulation", "Entrar como laboratorio y mover etapas": "Sign in as the lab and move stages",
    "Maqueta con datos de ejemplo. Ningún archivo sale de tu equipo.": "Mockup with sample data. No file ever leaves your device.",
    "Diseño y desarrollo:": "Design and development:",
  };

  const avisados = new Set();
  window.t = s => {
    if (IDIOMA !== "en") return s;
    if (s in EN) return EN[s];
    if (!avisados.has(s)) { avisados.add(s); console.warn("[textos] falta traducir:", s); }
    return s;
  };
  window.cambiarIdioma = l => {
    try { localStorage.setItem("meshlab-idioma", l); } catch (e) {}
    const u = new URL(location.href); u.searchParams.set("lang", l); location.href = u.toString();
  };
  document.documentElement.lang = IDIOMA;
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-t]").forEach(n => { n.textContent = t(n.dataset.t); }));
})();
