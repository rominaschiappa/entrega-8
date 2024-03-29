let apiCarrito = "https://japceibal.github.io/emercado-api/user_cart/25801.json"; //Traemos la API
let total = 0;

let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || []; //convierte la cadena JSON almacenada en 'carrito' de localStorage en JS

function carritoLocal() { //se declara la función
    let nuevoProducto = { //se declara la variable y se le asigna un objeto js que contiene los datos
        id: localStorage.getItem("prodID"),
        imagen: localStorage.getItem("imagenCarrito"),
        nombre: localStorage.getItem("nombreCarrito"),
        costo: localStorage.getItem("costoCarrito"),
        moneda: localStorage.getItem("monedaCarrito"),
        cantidad: 1,
    };

    let productoExistente = productosCarrito.find(item => item.nombre === nuevoProducto.nombre);
    //busca un producto en el carrito que tenga el mismo nombre que el producto nuevo

    if (productoExistente) { // si encuentra un producto con el mismo nombre
        productoExistente.cantidad++; // incrementa la cantidad del producto existente en el carrito
    } else {
        nuevoProducto.cantidad = 1; // si no, establece la cantidad del nuevo en 1
        productosCarrito.push(nuevoProducto); // agrega el nuevo producto al carrito
    }

    localStorage.setItem('carrito', JSON.stringify(productosCarrito));
    // actualiza el local c el carrito actualizado convertido a JSON
}

async function carritoFetch() { // declaramos la función asíncrona
    let res = await fetch(apiCarrito); // le hacemos un fetch a la api
    let data = await res.json(); // esperamos a que la respuesta se convierta en JSON
    return data; //devuelve los datos
}

mostrarCarrito();

async function mostrarCarrito() { //muestra los detalles del carrito de compras
    let element = await carritoFetch(); //se obtienen los datos del carrito
    let contenedor = document.querySelector("main .container"); //seleccionamos el main container en el DOM

    //actualizamos el contenido HTML del contenedor
    contenedor.innerHTML += ` 
        <h2 class="container">Carrito de Compras</h2>
        <br>
        <h3>Artículos a comprar</h3>
        <br>
        <table class="tabla-carrito" id="tabla-carrito">
            <tr class="titulos">
                <th></th>
                <th>Nombre</th>
                <th>Costo</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
            </tr>
            <br>
            <tr> 
                <td><img class="imagen-carrito" src="${element.articles[0].image}"/></td>
                <td>${element.articles[0].name}</td>
                <td>${element.articles[0].currency} ${element.articles[0].unitCost}</td>
                <td><input id="cantidadInput" value="1" type="number" name="${element.articles[0].unitCost}"></td>
                <td id="total" class="negrita">${element.articles[0].currency} ${element.articles[0].unitCost}</td> 
            </tr>
        </table>
    `
    //se ponen los datos del primer articulo
    //AQUI MOSTRAMOS EL PRODUCTO REQUERIDO POR LA TAREA, EL  QUE SE SOLLICITO POR DEFECTO;



    //itera los productos en el carrito y actualizar dinámicamente la tabla con la info de cada producto

    let cont_tabla = document.getElementById("tabla-carrito"); //// Selecciona el elemento de la tabla en el DOM


    productosCarrito.forEach((producto) => { // itera sobre cada producto en el carrito
        let fila_tabla = document.createElement("tr"); // crea una nueva fila en la tabla para el producto
        if (producto.nombre != null) { // Verifica el nombre del producto 
            fila_tabla.innerHTML = `
                <td><img class="imagen-carrito" src="${producto.imagen}"/></td>
                <td>${producto.nombre}</td>
                <td>${producto.moneda} ${producto.costo}</td>
                <td><input class="cantidadInputNuevo" type="number" value="${producto.cantidad}" id="cantidad_${producto.nombre}">
                <div id="errorCantidad" class="error-message"></div>
                </td>
                <td id="subTotal" class="negrita">${producto.moneda} <span class="costoProducto">${producto.cantidad * producto.costo}</span></td>
                <td><button class="btn-quitar-producto quitarProducto " data-nombre="${producto.nombre}"> Eliminar</button></td>
            `
            // estructura HTML para mostrar la info del producto
            //AQUI MOSTRAMOS TODOS LOSPRODUCTOS  TRAIDOS DE LA API;

            cont_tabla.appendChild(fila_tabla);//AGREGAMOS LOS PRODUCTOS A LA TABLA

            localStorage.removeItem('nombreCarrito'); 
            localStorage.setItem('costoCarrito', producto.costo); // Guarda el costo del producto en el almacenamiento local
        }

        let cantidadInputNuevo = document.querySelectorAll(".cantidadInputNuevo"); // Selecciona todos los inputs de cantidad
        let costoProducto = document.querySelectorAll(".costoProducto"); // Selecciona todos los elementos que muestran el costo del producto

        //Proceso para que recorra todos los input de CANTIDAD y aumente/disminuya su precio por cada uno en tiempo real
        cantidadInputNuevo.forEach((input, index) => { // itera sobre cada input de cantidad
            input.addEventListener("input", () => { // agrega un event listener para el evento de entrada
                let cantidadInputID = input.getAttribute("id"); // obtiene el ID del input de cantidad
                let productoNombre = cantidadInputID.split("_")[1]; // extrae el nombre del producto del ID
                let cantidad = parseFloat(input.value); // convierte la cantidad ingresada a un número decimal
                let producto = productosCarrito.find(item => item.nombre === productoNombre); // busca el producto en el carrito por nombre

                if (!isNaN(cantidad) && producto) { // verifica si la cantidad es un número y el producto existe
                    let costo = parseFloat(producto.costo); // obtiene el costo del producto
                    let subtotal = cantidad * costo; // calcula el subtotal multiplicando la cantidad por el costo
                    costoProducto[index].textContent = ` ${subtotal}`; // actualiza el texto que muestra el subtotal del producto
                } else {
                    costoProducto[index].textContent = `${producto.moneda} 0.00`; // si la cantidad no es válida, muestra un subtotal de 0.00
                }
            });
        });
        actualizarPrecios()//ESTA FUNCION AL FINAL HACE QUE SE ACTUALICEN EN TIEMPO REAL
    });


    //actualización del total en tiempo real cuando se cambia la cantidad de productos en el carrito

    let cantidadInput = document.getElementById("cantidadInput"); // selecciona el elemento del input de cantidad en el DOM
    let totalTd = document.getElementById("total"); // selecciona el elemento de la celda de total en el DOM

    cantidadInput.addEventListener("input", calcularTotal);// Agrega un event listener para el evento de entrada en el input de cantidad

    async function calcularTotal() { //Funcion que calcula el Total de todos los productos
        let element = await carritoFetch(); // Obtiene los datos del carrito mediante la función asíncrona carritoFetch
        let cantidad = cantidadInput.value; // Obtiene la cantidad ingresada en el input
        let precioUnitario = element.articles[0].unitCost; // Obtiene el precio unitario del primer producto en la lista
        let total = cantidad * precioUnitario; // Calcula el total multiplicando la cantidad por el precio unitario
        let tipoMoneda = element.articles[0].currency; // Obtiene el tipo de moneda del primer producto en la lista

        totalTd.textContent = tipoMoneda + " " + total; // Actualiza el texto en la celda de total con el nuevo valor calculado
    }
    }


let btnTema = document.getElementById('btnTema'); // Selecciona el elemento del botón de cambio de tema en el DOM
let body = document.body; // Selecciona el elemento body del DOM

// Función para cambiar el tema
function toggleTheme() {
    if (body.classList.contains('dark-theme')) { // Verifica si el cuerpo tiene la clase 'dark-theme'
        body.classList.remove('dark-theme'); // Si la tiene, la elimina
        localStorage.setItem('theme', 'light'); // Guarda 'light' en el almacenamiento local para recordar el tema
    } else {
        body.classList.add('dark-theme'); // Si no la tiene, agrega la clase 'dark-theme'
        localStorage.setItem('theme', 'dark'); // Guarda 'dark' en el almacenamiento local para recordar el tema
    }
}

let currentTheme = localStorage.getItem('theme'); // Obtiene el tema actual almacenado en el almacenamiento local
if (currentTheme === 'dark') {
    body.classList.add('dark-theme'); // Si el tema actual es 'dark', agrega la clase 'dark-theme'
} else {
    body.classList.add('light-theme'); // Si no, agrega la clase 'light-theme' 
}

btnTema.addEventListener('click', toggleTheme); // Agrega un event listener al botón para cambiar el tema cuando se hace clic


//MOSTRAR BOTON CON NOMBRE DE USUARIO
let email = localStorage.getItem("email"); // Obtiene el nombre de usuario del almacenamiento local
let li_nav = document.getElementById("usuario"); // Selecciona el elemento li_nav del DOM
li_nav.innerHTML = `<span class="nav-link">${email}</span>`;
//// Inserta un span con la clase "nav-link" que contiene el nombre de usuario en el elemento li_nav




//INICIO ENTREGA 6 PUNTO 1

//SUBTOTAL 

let subtotaldeTodos = document.querySelector(".subtotaldeTodos"); 
// subtotaldeTodos referencia al elemento en el DOM donde se muestra el subtotal general


    document.addEventListener("DOMContentLoaded", function () {
        // DOMContentLoaded hace el cálculo después de que se haya cargado la pág.
    
        let subtotales = document.querySelectorAll(".costoProducto");
        //subtotales son todos los elementos en el DOM con la clase .costoProducto (precios unitarios de los productos en el carrito)

    let total = 0;
//Iniciamos una variable total en 0, que se utilizará para guardar la suma de todos los subtotales

    subtotales.forEach(subtotal => {
        total += parseFloat(subtotal.textContent);
    });
//iteramos los subtotales con un forEach donde para c/ subtotal, se suma su contenido dsps de parsearlo como decimal al total

    subtotaldeTodos.textContent = "USD " + total.toFixed(2);
    //se muestra el resultado en subtotaldeTodos con el formato "USD X.XX" (X.XX valor calculado)
    //se usa total.toFixed(2) para redondear a dos decimales
});

//actualiza el subtotal en tiempo real cuando se cambian las cantidades
document.addEventListener("input", function (event) {
    //evento de escucha para el input... actua cuando el usuario modifica la cantidad
    if (event.target.classList.contains("cantidadInputNuevo")) {
// este if chequea si ese evento fue en un elemento con la clase cantidadInputNuevo
// esto nos asegurar que solo se actualiza el subtotal cuando cambian las cantidades

        // mismo proceso que antes
        let subtotales = document.querySelectorAll(".costoProducto");
        let total = 0;
        subtotales.forEach(subtotal => {
            total += parseFloat(subtotal.textContent);
        });
        subtotaldeTodos.textContent = "USD " + total.toFixed(2);

        //se llama a la función que hace el cálculo del costo de envío y actualiza el total final
        calcularTotal();
    }
});

//COSTO DE ENVIO 


// usamos DOMContentLoaded para que el código se ejecute una vez que la pág se haya cargado 
document.addEventListener("DOMContentLoaded", function () {

    //referencias a elementos del dom
    let subtotaldeTodos = document.querySelector(".subtotaldeTodos");
    let subtotaldeEnvio = document.querySelector(".subtotaldeEnvio");
    let premiumRadio = document.getElementById("premium");
    let expressRadio = document.getElementById("express");
    let standardRadio = document.getElementById("standard");

    // llamamos a la función CalcularSubtotaldeEnvio para calcular y mostrar el costo de envío inicialmente.
    CalcularSubtotaldeEnvio();

    //agregamos event listeners a los elementos de entrada de radio para q cdo el usuario cambie su selección, se calcule el costo de envío respectivamente
    premiumRadio.addEventListener("change", CalcularSubtotaldeEnvio);
    expressRadio.addEventListener("change", CalcularSubtotaldeEnvio);
    standardRadio.addEventListener("change", CalcularSubtotaldeEnvio);

    // realiza el cálculo del costo de envío
    function CalcularSubtotaldeEnvio() {
        let subtotalTodos = parseFloat(subtotaldeTodos.textContent.replace("USD ", ""));
          // Obtiene el valor del subtotal general y lo parsea como decimal
        let porcentajeSubtotal = 0; 
        
        // elige porcentaje costo de envío según el tipo de envío seleccionado 

        if (premiumRadio.checked) {
            porcentajeSubtotal = 0.15; // 15%
        } else if (expressRadio.checked) {
            porcentajeSubtotal = 0.07; // 7%
        } else if (standardRadio.checked) {
            porcentajeSubtotal = 0.05; // 5%
        }
// y se le agrega a la variable inicializada en 0 anteriormente


        //Calcula el costo de envío multiplicando el subtotal general por el porcentaje
        let subtotalconEnvio = subtotalTodos * porcentajeSubtotal;
        subtotaldeEnvio.textContent = "USD " + subtotalconEnvio.toFixed(2); //le da formato texto al resultado con "USD XX.XX".
        
    }

});

//TOTAL 

//actualiza contenido de subtotaldeEnvio con el nuevo costo de envío calculado

document.addEventListener("DOMContentLoaded", function () {
    let subtotaldeEnvio = document.querySelector(".subtotaldeEnvio");
    let subtotaldeTodos = document.querySelector(".subtotaldeTodos");
    let totaldeTodo = document.querySelector(".totaldeTodo");

    calcularYmostrarTotal();

    subtotaldeEnvio.addEventListener("DOMSubtreeModified", calcularYmostrarTotal);
    subtotaldeTodos.addEventListener("DOMSubtreeModified", calcularYmostrarTotal);

    function calcularYmostrarTotal() {
        let subtotalEnvio = parseFloat(subtotaldeEnvio.textContent.replace("USD ", ""));//Parsea el resultado para que puedan mostrarse
        let subtotalTodos = parseFloat(subtotaldeTodos.textContent.replace("USD ", ""));//Parsea el resultado para que puedan mostrarse

        let total = subtotalTodos + subtotalEnvio;
        totaldeTodo.textContent = "USD " + total.toFixed(2);//Se muestran en pantalla con decimales
    }
});

function actualizarPrecios() {//Funcion para actualizar los Precios, se usa en todas las funciones que requieran un cambio DE PRECIO en tiempo real en sus modificaciones de cantidad
    let subtotaldeTodos = document.querySelector(".subtotaldeTodos");
    let subtotaldeEnvio = document.querySelector(".subtotaldeEnvio");
    let totaldeTodo = document.querySelector(".totaldeTodo");
    
    let subtotales = document.querySelectorAll(".costoProducto");
    let totalSubtotal = 0;
    
    subtotales.forEach(subtotal => {
        totalSubtotal += parseFloat(subtotal.textContent);
    });
    
    let premiumRadio = document.getElementById("premium");
    let expressRadio = document.getElementById("express");
    let standardRadio = document.getElementById("standard");
    let porcentajeSubtotal = 0;
    
    //MODIFICA EL PRECIO SEGUN LA OPCIÓN SELECCIONADA, CADA UNA DARÁ UN PORCENTAJE DISTINTO EN BASE AL SUBTOTAL
    if (premiumRadio.checked) {
        porcentajeSubtotal = 0.15; // 15%
    } else if (expressRadio.checked) {
        porcentajeSubtotal = 0.07; // 7%
    } else if (standardRadio.checked) {
        porcentajeSubtotal = 0.05; // 5%
    }
    
    let subtotalEnvio = totalSubtotal * porcentajeSubtotal;
    let total = totalSubtotal + subtotalEnvio;
    
    subtotaldeTodos.textContent = "USD " + totalSubtotal.toFixed(2);
    subtotaldeEnvio.textContent = "USD " + subtotalEnvio.toFixed(2);
    totaldeTodo.textContent = "USD " + total.toFixed(2);
}

//FIN ENTREGA 6 PARTE 1



//INICIO ENTREGA 6 PARTE 2 - elegir método pago

//selecciona los elementos del DOM relacionados con las opciones de pago y sus campos asociados.
let checkTarjeta = document.getElementById("checkTarjeta");
let checkTransferencia = document.getElementById("checkTransferencia");
let camposTarjeta = document.querySelectorAll(".campos-tarjeta");
let camposTransferencia = document.querySelectorAll(".campos-transferencia");

checkTarjeta.addEventListener("change", function () { //EVENTO DE CAMBIO QUE AL CLICKEAR CHECK TARJETA HABILITA LOS CAMPOS DE TARJETA DE CREDITO
    habilitarCampos(camposTarjeta, checkTarjeta.checked);
    habilitarCampos(camposTransferencia, !checkTarjeta.checked);
});

checkTransferencia.addEventListener("change", function () {//EVENTO DE CAMBIO QUE AL CLICKEAR EN CHECK TRANSFERENCIA HABILITA LOS CAMPOS DE TRANSFERENCIA BANCARIA
    habilitarCampos(camposTransferencia, checkTransferencia.checked);
    habilitarCampos(camposTarjeta, !checkTransferencia.checked);
});

function habilitarCampos(campos, habilitar) {//FUNCIÓN QUE HABILITA LOS CAMPOS SEGÚN LA OPCIÓN SELECCIONADA, O MEJOR DICHO, SE DESHABILITAN LOS OPUESTOS AL QUE ELEJIMOS.
    campos.forEach(campo => {
        campo.disabled = !habilitar;
    });

    let errorFormaPago = document.getElementById("errorFormaPago");

    if (!habilitar) {
        errorFormaPago.textContent = "Selecciona una forma de pago";
    } else {
        errorFormaPago.textContent = "";
    }
}
//FIN ENTREGA 6 PARTE 2





// INICIO ENTREGA 6 PARTE 3 - validacion formulario de compra

//Cuando se carga la página, busca botón con id FinalizarCompra y se agrega un event listener q ejecutará la función validarCompra cuando se haga clic
document.addEventListener("DOMContentLoaded", function () {
    const btnFinalizarCompra = document.getElementById("FinalizarCompra");
    btnFinalizarCompra.addEventListener("click", validarCompra);
});

function validarCompra() {//FUNCIÓN PARA VALIDAR COMPRA
    let valid = true;


    // VALIDACIÓN DE CALLE, NUMERO, ESQUINA
    const calle = document.getElementById("calle");
    const numero = document.getElementById("numero");
    const esquina = document.getElementById("esquina");
    const errorCalle = document.getElementById("errorCalle");
    const errorNumero = document.getElementById("errorNumero");
    const errorEsquina = document.getElementById("errorEsquina");


    //SE CORRE UN PROCESO DE IF QUE VERIFIQUE QUE LOS CAMPOS NO ESTÉN VACÍOS, Y SI LO ESTÁN SE ENVÍA MENSAJE DE ERROR.
    if (!calle.value.trim()) {
        errorCalle.textContent = "La calle no puede estar vacía.";
        errorCalle.style.color = "red";
        valid = false;
        calle.classList.add("error-field");
    } else {
        errorCalle.textContent = "";
        calle.classList.remove("error-field")
    }

    if (!numero.value.trim()) {
        errorNumero.textContent = "El número no puede estar vacío.";
        errorNumero.style.color = "red";
        valid = false;
        numero.classList.add("error-field");
        
    } else {
        errorNumero.textContent = "";
        numero.classList.remove("error-field")
    }

    if (!esquina.value.trim()) {
        errorEsquina.textContent = "La esquina no puede estar vacía.";
        errorEsquina.style.color = "red";
        valid = false;
        esquina.classList.add("error-field");
    } else {
        errorEsquina.textContent = "";
        esquina.classList.remove("error-field")
    }



    // VALIDACIÓN DE FORMA DE ENVÍO
    const tipoEnvioPremium = document.getElementById("premium");
    const tipoEnvioExpress = document.getElementById("express");
    const tipoEnvioStandard = document.getElementById("standard");
    const errorEnvio = document.getElementById("errorEnvio");

    //CON UN IF SE VERIFICA QUE AL MENOS UN INPUT ESTÁ SELECCIONADO, SINO MUESTRA MENSAJE DE ERROR
    if (!(tipoEnvioPremium.checked || tipoEnvioExpress.checked || tipoEnvioStandard.checked)) {
        errorEnvio.textContent = "Debe seleccionar un tipo de envío.";
        errorEnvio.style.color = "red";
        valid = false;
    } else {
        errorEnvio.textContent = "";
    }


    const cantidadInputNuevo = document.querySelectorAll(".cantidadInputNuevo");
    const errorCantidad = document.getElementById("errorCantidad");
    let cantidadValida = true;//Se inicia la variable con booleano para poder utilizarla a gusto en el IF


//IF PARA VERIFICAR SI LA CANTIDAD DE PRODUCTOS ES IGUAL O MENOR A 0, SE ENVÍA MENSAJE DE ERROR, AL MENOS DEBE HABER 1 PRODUCTO.
    cantidadInputNuevo.forEach(input => {
        const cantidad = parseFloat(input.value);
        if (isNaN(cantidad) || cantidad <= 0) {
            cantidadValida = false;
            input.style.borderColor = "red";

        } else {
            input.style.borderColor = "";
        }
    });

    if (!cantidadValida) {
        errorCantidad.textContent = "La cantidad para uno o más artículos es inválida.";
        errorCantidad.style.color = "red";
        valid = false;
    } else {
        errorCantidad.textContent = "";
    }



    // VALIDACIÓN FORMA DE PAGO
const tipoPagoCredito = document.getElementById("checkTarjeta");
const tipoPagoTransferencia = document.getElementById("checkTransferencia");
const numTarjeta = document.getElementById("nroTarjeta");
const codSeguridad = document.getElementById("codSeguridad");
const fechaVencimiento = document.getElementById("fechaVencimiento");
const numCuentaTransferencia = document.getElementById("nrodeCuenta");
const errorFormaPago = document.getElementById("errorFormaPago");

/*SE EJECUTA UN IF QUE VERIFICA LA FORMA DE PAGO, UNA VEZ SELECCIONADA PEDIRÁ LLENAR LOS INPUTS CORRESPONDIENTES Y
SOLO DEJARÁ CONTINUAR SI CUMPLEN CON UNA FORMA DE PAGO Y LOS INPUTS LLENOS*/

if (!tipoPagoCredito.checked && !tipoPagoTransferencia.checked) {
    errorFormaPago.textContent = "Debe seleccionar una forma de pago.";
    errorFormaPago.style.color = "red";
    valid = false;
} else {
    errorFormaPago.textContent = "";
}

if (tipoPagoCredito.checked) {
    if (!numTarjeta.value.trim() || !codSeguridad.value.trim() || !fechaVencimiento.value.trim()) {
        errorFormaPago.textContent = "Los campos de tarjeta de crédito no pueden estar vacíos.";
        errorFormaPago.style.color = "red";
        valid = false;
    }
} else if (tipoPagoTransferencia.checked) {
    if (!numCuentaTransferencia.value.trim()) {
        errorFormaPago.textContent = "El campo de número de cuenta no puede estar vacío.";
        errorFormaPago.style.color = "red";
        valid = false;
    }
}

if (valid) {
    document.getElementById("mensajeCompraExitosa").style.display = "block";
    document.getElementById("formularioEnvioCliente").style.display = "none";
}
}
//FIN ENTREGA 6 PARTE 3




//ENTREGA 6 DESAFIATE 

//EVENTO DE CLICK QUE ELIMINA EL PRODUCTO DEL CARRITO AL CLICKEAR EN ÉL
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("quitarProducto")) {
// Se verifica si el elemento clickeado tiene la clase "quitarProducto"

        let productName = event.target.getAttribute("data-nombre");
// Se obtiene el nombre del producto a través del atributo "data-nombre"

        productosCarrito = productosCarrito.filter(product => product.nombre !== productName);
// Se filtran los productos en el carrito, eliminando el producto con el nombre correspondiente

        localStorage.setItem('carrito', JSON.stringify(productosCarrito));
// Se actualiza el carrito en el almacenamiento local con la nueva lista de productos

        event.target.closest("tr").remove();
        // Se elimina la fila (elemento <tr>) más cercana (ancestro más cercano) al botón clickeado
    }
});

document.addEventListener("DOMContentLoaded", actualizarPrecios);//SE ACTUALIZAN LOS PRECIOS AL ELIMINAR EL PRODUCTO.
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("quitarProducto")) {
        actualizarPrecios();
    }
});


//FIN ENTREGA 6 DESAFIATE
