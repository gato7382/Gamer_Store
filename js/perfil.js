// Mostrar datos del usuario activo en el perfil
document.addEventListener("DOMContentLoaded", function() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (usuario) {
        document.getElementById('userName').textContent = usuario.nombre || '';
        document.getElementById('userEmail').textContent = usuario.email || '';
        document.getElementById('firstName').value = usuario.nombre || '';
        document.getElementById('lastName').value = usuario.apellidos || '';
        document.getElementById('email').value = usuario.email || '';
        document.getElementById('phone').value = usuario.telefono || '';
        document.getElementById('birthdate').value = usuario.fechaNacimiento || '';
        document.getElementById('gender').value = usuario.genero || 'other';
        document.getElementById('preferredCategory').value = usuario.categoriaFavorita || '';
        document.getElementById('gamingPlatform').value = usuario.plataformaPrincipal || '';
        document.getElementById('gamerTag').value = usuario.gamerTag || '';
        document.getElementById('bio').value = usuario.bio || '';
        document.getElementById('newsletter').checked = !!usuario.newsletter;
        document.getElementById('notifications').checked = !!usuario.notificaciones;
    } else {
        // Si no hay usuario, redirige a inicio de sesión
        window.location.href = "ini_sesion.html";
    }
});

// Validación y guardado
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Validaciones
    const nombre = document.getElementById('firstName').value.trim();
    const apellidos = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('phone').value.replace(/\s+/g, '').trim();
    const fechaNacimiento = document.getElementById('birthdate').value;
    const gamerTag = document.getElementById('gamerTag').value.trim();

    if (!nombre) return alert('El nombre es obligatorio.');
    if (!email || !/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email)) return alert('Correo electrónico inválido.');
    if (telefono && !/^\+?\d{7,15}$/.test(telefono)) return alert('Teléfono inválido.');
    if (fechaNacimiento) {
        const birthdate = new Date(fechaNacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const m = today.getMonth() - birthdate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) age--;
        if (age < 18) return alert('Debes ser mayor de 18 años.');
    }
    if (gamerTag && gamerTag.length < 3) return alert('El Gamer Tag debe tener al menos 3 caracteres.');

    // Guardar cambios en localStorage
    let usuario = JSON.parse(localStorage.getItem("usuarioActivo")) || {};
    usuario.nombre = nombre;
    usuario.apellidos = apellidos;
    usuario.email = email;
    usuario.telefono = telefono;
    usuario.fechaNacimiento = fechaNacimiento;
    usuario.genero = document.getElementById('gender').value;
    usuario.categoriaFavorita = document.getElementById('preferredCategory').value;
    usuario.plataformaPrincipal = document.getElementById('gamingPlatform').value;
    usuario.gamerTag = gamerTag;
    usuario.bio = document.getElementById('bio').value;
    usuario.newsletter = document.getElementById('newsletter').checked;
    usuario.notificaciones = document.getElementById('notifications').checked;

    // Actualiza nombre y correo en la barra lateral
    document.getElementById('userName').textContent = usuario.nombre;
    document.getElementById('userEmail').textContent = usuario.email;

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

    // Actualiza también en usuariosNuevos si existe
    let nuevosUsuarios = JSON.parse(localStorage.getItem("usuariosNuevos")) || [];
    const idx = nuevosUsuarios.findIndex(u => u.email === usuario.email);
    if (idx !== -1) {
        nuevosUsuarios[idx] = usuario;
        localStorage.setItem("usuariosNuevos", JSON.stringify(nuevosUsuarios));
    }

    alert('¡Tus cambios se han guardado correctamente!');
});

// Manejo del botón cancelar
document.querySelector('.btn-cancel').addEventListener('click', function() {
    if(confirm('¿Estás seguro de que deseas descartar los cambios?')) {
        location.reload();
    }
});

// Validación de fecha de nacimiento (mayor de 18 años)
document.getElementById('birthdate').addEventListener('change', function() {
    const birthdate = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) age--;
    if (age < 18) {
        alert('Debes ser mayor de 18 años para registrarte en Level-Up Gamer');
        this.value = '';
    }
});

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "inicio.html";
}