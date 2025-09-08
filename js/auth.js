document.addEventListener("DOMContentLoaded", mostrarUsuarioActivo);

// Mostrar usuario activo o botones en el header
function mostrarUsuarioActivo() {
  const userArea = document.getElementById("user-area");
  if (!userArea) return;
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (usuario) {
    userArea.innerHTML = `
      <a href="perfil.html" 14;"class="btn btn-login" style="background-color:#39FF14;color:#000;border:2px solid #39FF>
        <i class="fas fa-user"></i> Mi Cuenta
      </a>
    `;
  } else {
    userArea.innerHTML = `
      <button onclick="window.location.href='ini_sesion.html'" class="btn btn-login" style="background-color:#39FF14;color:#000;border:2px solid #39FF14;margin-right:10px;">
        Iniciar sesión
      </button>
      <button onclick="window.location.href='registro.html'" class="btn btn-login" style="background-color:#39FF14;color:#000;border:2px solid #39FF14;">
        Registrarse
      </button>
    `;
  }
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  mostrarUsuarioActivo();
  window.location.reload();
}

// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const clave = document.getElementById("clave").value;
  const resultado = document.getElementById("resultado");

  try {
    const respuesta = await fetch("usuarios.json");
    let usuarios = await respuesta.json();

    // Agrega usuarios registrados en localStorage
    const nuevosUsuarios = JSON.parse(localStorage.getItem("usuariosNuevos")) || [];
    usuarios = usuarios.concat(nuevosUsuarios);

    const usuario = usuarios.find(u => u.email === email && u.clave === clave);

    if (usuario) {
      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      window.location.href = "inicio.html";
    } else {
      resultado.innerText = "❌ Usuario o contraseña incorrectos";
    }
  } catch (error) {
    resultado.innerText = "⚠️ No se pudo acceder a la base de usuarios";
  }
}

// REGISTRO
async function registrar() {
  const nombre = document.getElementById("reg-nombre").value;
  const edad = document.getElementById("reg-edad").value;
  const email = document.getElementById("reg-email").value;
  const clave = document.getElementById("reg-clave").value;
  const resultado = document.getElementById("resultado");

  if (!nombre || !edad || !email || !clave) {
    resultado.innerText = "Completa todos los campos";
    return;
  }

  let usuarios = [];
  try {
    const respuesta = await fetch("usuarios.json");
    usuarios = await respuesta.json();
  } catch (e) {}

  const nuevosUsuarios = JSON.parse(localStorage.getItem("usuariosNuevos")) || [];
  usuarios = usuarios.concat(nuevosUsuarios);

  if (usuarios.find(u => u.email === email)) {
    resultado.innerText = "El correo ya está registrado";
    return;
  }

  const nuevoUsuario = { nombre, email, clave };
  nuevosUsuarios.push(nuevoUsuario);
  localStorage.setItem("usuariosNuevos", JSON.stringify(nuevosUsuarios));
  localStorage.setItem("usuarioActivo", JSON.stringify(nuevoUsuario));
  window.location.href = "inicio.html";
}