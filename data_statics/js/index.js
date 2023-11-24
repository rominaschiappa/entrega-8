const carrusel = document.getElementById('toggle');

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("cars").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("toys").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("furniture").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

// chequea si el usuario está o no logeado
function isLoggedIn() {
    let dato = localStorage.getItem("email");
    if (dato){
        return true;
    }else{
        return false;
    }
}

// entrega 4, parte 2: función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("email");
    window.location.href = 'login.html'; //redirige al inicio
}

// entrega 4, parte 2: evento click cerrar sesión
document.getElementById("cerrarSesion").addEventListener("click", function() {
    cerrarSesion();
} );

// este evento de escucha se activa cuando la pag se carga y verifica si el usuario inició sesión con isloggedin
window.addEventListener('load', function() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
});

//Entregable 2
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

  body.classList.add('light-theme')
  }
    
// Agregar un listener al botón para cambiar el tema cuando se hace clic
btnTema.addEventListener('click', toggleTheme);



//Mostrar email como boton en Nav

//una vez que está chequeado si el usuario inició sesión, recupera el email desde el local
// y lo almacena en la variable email
let email = localStorage.getItem("email"); // <- email = "emilianopintos18@gmail.com"
let li_nav = document.getElementById("usuario");
li_nav.innerHTML = `<span class="nav-link">${email}</span>`;

