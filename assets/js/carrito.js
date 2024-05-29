const btnAddcarrito = document.querySelectorAll(".btnAddcarrito");
const btnCarrito = document.querySelector("#btnCantidadCarrito");
const verCarrito = document.querySelector('#verCarrito');
const tableListaCarrito = document.querySelector('#tableListaCarrito tbody');

let listaCarrito = [];
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("listaCarrito") != null) {
        listaCarrito = JSON.parse(localStorage.getItem("listaCarrito"));
    }
    btnAddcarrito.forEach((btn, index) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            let idProducto = btn.getAttribute("prod");
            agregarCarrito(idProducto, 1);
        });
    });
    cantidadCarrito();

    verCarrito.addEventListener('click', function () {
        getListaCarrito();
        $('#modalCarrito').modal('show');
    });
});

// Agregar productos al carrito
function agregarCarrito(idProducto, cantidad) {
    if (!localStorage.getItem("listaCarrito")) {
        listaCarrito = [];
    } else {
        let listaExiste = JSON.parse(localStorage.getItem("listaCarrito"));
        if (listaExiste.some(item => item.idProducto == idProducto)) {
            alertaPerzanalizada("EL PRODUCTO YA ESTA AGREGADO", "warning");
            return;
        }
        listaCarrito = listaExiste;
    }

    listaCarrito.push({ idProducto: idProducto, cantidad: cantidad });
    localStorage.setItem("listaCarrito", JSON.stringify(listaCarrito));
    alertaPerzanalizada("PRODUCTO AGREGADO AL CARRITO", "success");
    cantidadCarrito();
}

function cantidadCarrito() {
    let listas = JSON.parse(localStorage.getItem("listaCarrito"));
    btnCarrito.textContent = listas ? listas.length : 0;
}

// Ver carrito
function getListaCarrito() {
    const url = base_url + 'principal/listaProductos';
    const http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.send(JSON.stringify(listaCarrito));
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(this.responseText);
            let html = '';
            res.productos.forEach(producto => {
                html += `<tr>
                    <td><img class="img-thumbnail" src="${base_url + producto.imagen}" alt="" width="100"></td>
                    <td>${producto.nombre}</td>
                    <td><span class="badge bg-warning">${res.moneda + ' ' + producto.precio}</span></td>
                    <td width="100"><input type="number" class="form-control agregarCantidad" id="${producto.id}" value="${producto.cantidad}"></td>
                    <td>${producto.subTotal}</td>
                    <td><button class="btn btn-danger btnDeletecart" type="button" prod="${producto.id}"><i class="fas fa-times-circle"></i></button></td>
                </tr>`;
            });
            tableListaCarrito.innerHTML = html;
            document.querySelector('#totalGeneral').textContent = res.total;
            btnEliminarCarrito();
            cambiarCantidad();
        }
    }
}

function btnEliminarCarrito() {
    let listaEliminar = document.querySelectorAll('.btnDeletecart');
    listaEliminar.forEach(btn => {
        btn.addEventListener('click', function () {
            let idProducto = btn.getAttribute('prod');
            eliminarListaCarrito(idProducto);
        });
    });
}

function eliminarListaCarrito(idProducto) {
    listaCarrito = listaCarrito.filter(item => item.idProducto != idProducto);
    localStorage.setItem('listaCarrito', JSON.stringify(listaCarrito));
    getListaCarrito();
    cantidadCarrito();
    alertaPerzanalizada("PRODUCTO ELIMINADO DEL CARRITO", "success");
}

function cambiarCantidad() {
    let listaCantidad = document.querySelectorAll('.agregarCantidad');
    listaCantidad.forEach(input => {
        input.addEventListener('change', function () {
            let idProducto = input.id;
            let cantidad = input.value;
            incrementarCantidad(idProducto, cantidad);
        });
    });
}

function incrementarCantidad(idProducto, cantidad) {
    listaCarrito.forEach(item => {
        if (item.idProducto == idProducto) {
            item.cantidad = cantidad;
        }
    });
    localStorage.setItem('listaCarrito', JSON.stringify(listaCarrito));
}
