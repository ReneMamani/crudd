(function () {
    let DB;
    const tbodyListadoClientes = document.querySelector('#listado-clientes');

    window.onload = () => {
        crearDB(db => mostrarClientes(db));
        tbodyListadoClientes.addEventListener('click', eliminarRegistro);
    }

    function crearDB(callback) {
        const crearDB = window.indexedDB.open('crm', 1);
        crearDB.onerror = () => {
            console.log('Hubo un error');
        }

        crearDB.onsuccess = (e) => {
            DB = crearDB.result;
            if (callback) {
                return callback(e.target.result);
            }
        }

        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('DB LISTA Y CREADA');

        }

    }

    function mostrarClientes(db) {
        // Obtener el cursor
        const transaction = db.transaction('crm', 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.openCursor().onsuccess = (e) => {
            let cursor = e.target.result;
            if (cursor) {
                const cliente = cursor.value;

                const clienteHTML = crearElementoCliente({ ...cliente });
                tbodyListadoClientes.appendChild(clienteHTML);
                cursor.continue();
            } else {
                console.log('Todas las entradas fueron recorridas');
            }
        }

    }

    function crearElementoCliente(cliente) {
        const { nombre, empresa, email, telefono, id } = cliente;
        const row = document.createElement('tr');
        row.innerHTML += `
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                <p class="text-gray-700">${telefono}</p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                <p class="text-gray-600">${empresa}</p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                <button type="button" class="text-lg transition ease-in-out delay-150 bg-green-500 hover:-translate-y-1 hover:scale-110 hover:bg-greenenery-500 duration-300   rounded-md border-2 border-green-600 ">
                    <a href="editar-cliente.html?id=${id}" class="text-black-600 hover:text-teal-900 mr-5">Editar</a>
                </button>
                
                <button type="button" class="text-lg transition ease-in-out delay-150 bg-red-500 hover:-translate-y-1 hover:scale-110 hover:bg-black-500 duration-300   rounded-md border-2 border-red-600">
                    <a href="#" data-cliente="${id}" class="text-black-600 hover:text-black-900 eliminar">Eliminar</a>
                </button>
                
            </td>
        `
        return row;
    }

    function eliminarRegistro(e) {
        if (e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);

            const confirmar = confirm('Deseas eliminar este cliente?');
            if (confirmar) {
                try {
                    conectarDB(db => deleteClient(idEliminar, db))
                    e.target.parentElement.parentElement.remove();
                } catch (error) {
                    imprimirAlerta('Hubo un error al eliminar el registro de la base de datos. Contactese con un administrador o reintente nuevamente.', error);
                }
            }
            return;
        }
    }

    function deleteClient(id, db) {
        const transaction = db.transaction('crm', 'readwrite');
        const objectStore = transaction.objectStore('crm');
        
        objectStore.delete(id);
        transaction.oncomplete = (e) => {
            console.log('Registro eliminado exitosamente', e)
            
        }
        transaction.onerror = () => {
            imprimirAlerta('Hubo un error al eliminar el registro de la base de datos. Contactese con un administrador o reintente nuevamente.', error);
        }
    }
})();

