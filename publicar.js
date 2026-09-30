// PUBLICA la maqueta en https://seinp.github.io/meshlab-demo/ (GitHub Pages sirve la rama main tal cual).
//
//   node publicar.js              confirma todo y empuja a origin/main
//   node publicar.js "mensaje"    con un mensaje propio
//
// _demo/ (las 6 direcciones) queda fuera por .gitignore.
const { execFileSync } = require("child_process");

const AQUI = __dirname;
const git = (...args) => execFileSync("git", args, { cwd: AQUI, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();

const fecha = new Date().toISOString().slice(0, 16).replace("T", " ");
const mensaje = process.argv[2] || `Maqueta ${fecha}`;

if (git("status", "--porcelain")) {
  console.log(">>> [1/3] Confirmando cambios");
  git("add", "-A");
  git("commit", "-m", mensaje);
} else {
  console.log(">>> [1/3] Sin cambios nuevos; se empuja lo ya confirmado");
}
console.log(">>> [2/3] Empujando a origin/main");
execFileSync("git", ["push", "-u", "origin", "main"], { cwd: AQUI, stdio: "inherit" });
console.log(">>> [3/3] Listo. GitHub Pages tarda un minuto: https://seinp.github.io/meshlab-demo/");
