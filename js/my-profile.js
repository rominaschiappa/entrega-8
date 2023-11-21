let IMAGEN = ""; //Variable global para utilizarla en distintos lugares


//INICIO ENTREGA 7 PARTE 1
function isLoggedIn() {
  let dato = localStorage.getItem("email");
  if (dato) {
    return true;
  } else {
    return false;
  }
}

//función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("email");
  window.location.href = 'login.html'; //redirige al inicio
}

//evento click cerrar sesión
document.getElementById("cerrarSesion").addEventListener("click", function () {
  cerrarSesion();
});


window.addEventListener('load', function () {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let input = document.getElementById("inputEmail");
  if (email) {
    input.value = email;
  }
});
//FIN ENTREGA 7 PARTE 1




//INICIO ENTREGA 7 PARTE 2
document.getElementById("btnGuardarCambios").addEventListener("click", function () {
  let camposObligatorios = document.querySelectorAll('[required]');
  let todosCamposCompletos = true;

  localStorage.setItem("imgPerfil",IMAGEN);
  
  //RECORRE LOS CAMPOS OBLIGATORIOS Y SI ESTÁN VACÍOS LE PONEN LA CLASE INVÁLIDA, SINO, NO
  camposObligatorios.forEach(function (campo) {
    if (campo.value.trim() === "") {
      campo.classList.add("is-invalid");
      todosCamposCompletos = false;
    } else {
      campo.classList.remove("is-invalid");
    }
  });


  //SI ESTÁN AL MENOS LOS OBLIGATORIOS SE GUARDA EN UN OBJETO Y SE CARGA EN UN LOCALSTORAGE
  if (todosCamposCompletos) {
    let datosPerfil = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      telefono: document.getElementById("telefono").value,
      segnombre: document.getElementById("segnombre").value,
      segapellido: document.getElementById("segapellido").value,
    };
    localStorage.setItem("datosPerfil", JSON.stringify(datosPerfil));

    //   ALERTA EXITO BOOTSTRAP
    let successMessage = document.getElementById("success-message");
    successMessage.classList.remove("d-none");
    successMessage.classList.add("show");
  }
});



//FIN ENTREGA 7 PARTE 2






//INICIO ENTREGA 7 PARTE 3
//AL CARGAR LA PÁGINA, SI TIENE PERFIL GUARDADO,  SE CARGAN LOS VALORES DEL LOCALSTORAGE A LOS INPUTS
document.addEventListener("DOMContentLoaded", function () {
  let datosAlmacenados = localStorage.getItem("datosPerfil");
  if (datosAlmacenados) {
    let datosPerfil = JSON.parse(datosAlmacenados);

    document.getElementById("nombre").value = datosPerfil.nombre;
    document.getElementById("apellido").value = datosPerfil.apellido;
    document.getElementById("telefono").value = datosPerfil.telefono;
    document.getElementById("segnombre").value = datosPerfil.segnombre;
    document.getElementById("segapellido").value = datosPerfil.segapellido;
  }
});
//FIN ENTREGA 7 PARTE 3




//INICIO ENTREGA 7 DESAFIATE
let inputImagen = document.getElementById("inputImagen");

inputImagen.addEventListener("change", function () {
  let foto = document.getElementById("inputImagen").files[0];
  if (inputImagen.files && inputImagen.files[0]) {
    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      document.getElementById("imagenPerfil").src = event.target.result;

      IMAGEN = event.target.result;
    });
    reader.readAsDataURL(inputImagen.files[0]);
  } else {
    document.getElementById("imagenPerfil").src = "img/img_perfil.png"
    localStorage.removeItem("imgPerfil");
  }
}
);

document.addEventListener("DOMContentLoaded", function () {
  let imagenGuardada = localStorage.getItem("imgPerfil");
  let foto = document.getElementById("imagenPerfil");
  if (imagenGuardada) {
    foto.src = imagenGuardada;
  } else {
    foto.src = "img/img_perfil.png";
  }
});
//FIN ENTREGA 7 DESAFIATE





//OTRAS FUNCIONES NECESARIAS
const btnTema = document.getElementById('btnTema');
const body = document.body;
// Función para cambiar el tema
function toggleTheme() {
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light'); // Guardar el tema en el almacenamiento local
  } else {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark'); // Guardar el tema en el almacenamiento local
  }
}
// Verificar el tema almacenado en el almacenamiento local y aplicarlo si existe
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  body.classList.add('dark-theme');
} else {
  body.classList.add('light-theme');
}

// Agregar un listener al botón para cambiar el tema cuando se hace clic
btnTema.addEventListener('click', toggleTheme);


//Mostrar email como boton en Nav
let email = localStorage.getItem("email"); // <- email = "emilianopintos18@gmail.com"
let li_nav = document.getElementById("usuario");
li_nav.innerHTML = `<span class="nav-link">${email}</span>`;



