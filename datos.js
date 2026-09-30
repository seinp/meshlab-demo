// Todo el contenido de la maqueta. Datos de ejemplo: pacientes por codigo e iniciales, nunca nombre completo.
window.ETAPAS = [
  { id: "recibido",    nombre: "Recibido",              corto: "Recibido" },
  { id: "planeacion",  nombre: "En planeación",         corto: "Planeación" },
  { id: "simulacion",  nombre: "Simulación lista",      corto: "Simulación" },
  { id: "aprobado",    nombre: "Aprobado",              corto: "Aprobado" },
  { id: "fabricacion", nombre: "En fabricación",        corto: "Fabricación" },
  { id: "ruta",        nombre: "En ruta con mensajero", corto: "En ruta" },
  { id: "entregado",   nombre: "Entregado",             corto: "Entregado" },
];

// Que le dice el laboratorio al doctor en cada etapa (se usa al mover estados desde el panel).
window.NOTAS = [
  "Recibimos tu caso. Revisamos los archivos y empezamos la planeación.",
  "Nuestro equipo está planeando el tratamiento. Te avisamos al tener la simulación.",
  "La simulación está lista. Revísala y apruébala para pasar a fabricación.",
  "Aprobaste la simulación. Pasamos el caso a fabricación.",
  "Imprimiendo los modelos y termoformando los alineadores.",
  "El mensajero va en camino. Entrega estimada hoy antes de las 5:00 p. m.",
  "Entregado en tu clínica. ¡Gracias por confiar en MeshLab!",
];

window.TRATAMIENTOS = ["Alineadores", "Alineadores de finalización", "Retenedores activos", "Retenedores pasivos"];
window.ARCADAS = ["Superior", "Inferior", "Ambas"];

window.DOCTOR = { nombre: "Dra. Laura Méndez", clinica: "Ortho Sonrisa · Cali", correo: "laura@orthosonrisa.co" };

window.CASOS = [
  { cod: "ML-2431", doc: "Dra. Laura Méndez", pac: "A.G.", edad: 24, tipo: "Alineadores", arcada: "Ambas", etapa: 2, fecha: "28 sep", alineadores: 22, archivos: { fotos: 8, pdf: 1, stl: 2 } },
  { cod: "ML-2440", doc: "Dra. Laura Méndez", pac: "D.R.", edad: 16, tipo: "Alineadores", arcada: "Ambas", etapa: 0, fecha: "30 sep", alineadores: null, falta: "Radiografía panorámica", archivos: { fotos: 8, pdf: 0, stl: 2 } },
  { cod: "ML-2419", doc: "Dra. Laura Méndez", pac: "M.T.", edad: 31, tipo: "Alineadores", arcada: "Superior", etapa: 4, fecha: "21 sep", alineadores: 14, archivos: { fotos: 8, pdf: 1, stl: 2 } },
  { cod: "ML-2402", doc: "Dra. Laura Méndez", pac: "S.L.", edad: 42, tipo: "Retenedores pasivos", arcada: "Ambas", etapa: 5, fecha: "15 sep", alineadores: 2, archivos: { fotos: 6, pdf: 1, stl: 2 } },
  { cod: "ML-2436", doc: "Dra. Laura Méndez", pac: "J.V.", edad: 35, tipo: "Alineadores", arcada: "Ambas", etapa: 1, fecha: "29 sep", alineadores: null, archivos: { fotos: 8, pdf: 1, stl: 2 } },
  { cod: "ML-2388", doc: "Dra. Laura Méndez", pac: "C.P.", edad: 28, tipo: "Alineadores de finalización", arcada: "Ambas", etapa: 6, fecha: "02 sep", alineadores: 8, archivos: { fotos: 8, pdf: 1, stl: 2 } },
  // Casos de otros doctores: solo los ve el laboratorio
  { cod: "ML-2438", doc: "Dr. Andrés Rojas", pac: "L.M.", edad: 19, tipo: "Alineadores", arcada: "Ambas", etapa: 1, fecha: "29 sep", alineadores: null, archivos: { fotos: 8, pdf: 1, stl: 2 } },
  { cod: "ML-2433", doc: "Dr. Andrés Rojas", pac: "F.C.", edad: 27, tipo: "Retenedores activos", arcada: "Inferior", etapa: 3, fecha: "27 sep", alineadores: 4, archivos: { fotos: 8, pdf: 1, stl: 2 } },
  { cod: "ML-2427", doc: "Dra. Paula Herrera", pac: "N.S.", edad: 38, tipo: "Alineadores", arcada: "Ambas", etapa: 4, fecha: "25 sep", alineadores: 30, archivos: { fotos: 8, pdf: 1, stl: 2 } },
  { cod: "ML-2441", doc: "Dra. Paula Herrera", pac: "R.O.", edad: 22, tipo: "Alineadores", arcada: "Superior", etapa: 0, fecha: "30 sep", alineadores: null, archivos: { fotos: 8, pdf: 1, stl: 2 } },
];
