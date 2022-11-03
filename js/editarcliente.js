(function () {
    let idCliente;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        // Verificar el ID de la URL
        formulario.addEventListener('submit', actualizarCliente);
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');

        if (idCliente) {
            conectarDB(db => { obtenerCliente(idCliente, db) });
        }
    })

    function obtenerCliente(id, db) {
        const transaction = db.transaction('crm', 'readonly');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                const row = cursor.value;
                if (row.id === Number(id)) {
                    llenarForulario(row);
                }
                cursor.continue();
            }
        }
    }

    function llenarForulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function actualizarCliente(e) {
        e.preventDefault();
        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Actualizar cliente

        clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }
        conectarDB(db => putCliente(clienteActualizado, db));

    }

    function putCliente(cliente, db) {
        const transaction = db.transaction('crm', 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(cliente);
        transaction.oncomplete = () => {
            imprimirAlerta('Editado correctamente');
            formulario.reset();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
        transaction.onerror = () => {
            imprimirAlerta('Hubo un error', 'error');
        }
    }
})();