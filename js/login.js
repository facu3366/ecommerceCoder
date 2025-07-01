document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const contrasena = document.getElementById("contrasena").value;
  const errorMsg = document.getElementById("error");

  // Simulación de credenciales válidas
  if (usuario === "matefan" && contrasena === "yerba123") {
    localStorage.setItem("usuarioLogueado", usuario);
    window.location.href = "index.html"; // Redirige al e-commerce principal
  } else {
    errorMsg.textContent = "Usuario o contraseña incorrectos.";
  }
});
document.getElementById("continuarInvitado").addEventListener("click", function() {
  localStorage.setItem("usuarioLogueado", "Invitado");
  window.location.href = "index.html";
});

document.getElementById("crearUsuario").addEventListener("click", function(e) {
  e.preventDefault();
  alert("Función de crear usuario aún no implementada.");
});
