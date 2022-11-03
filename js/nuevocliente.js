(function () {
    let DB;
    const formulario = document.querySelector('#formulario');
    window.onload = () => {
        conectarDB();
        formulario.addEventListener('submit', validarCliente);
    }

    function validarCliente(e) {
        e.preventDefault();

        //Leyendo inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            console.error('Campos obligatorios');
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Crear un objeto con la informacion

        const cliente = { id: Date.now(), nombre, email, telefono, empresa }
        conectarDB(db => {
            crearNuevoCliente(db, cliente)
        });
    }

    function crearNuevoCliente(db, cliente){
        const transaction = db.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);
        transaction.onerror = () => {
            imprimirAlerta('Hubo un error - Email no valido', 'error');
            transaction.db.close();
        }
        transaction.oncomplete = () => {
            imprimirAlerta('El cliente se creo correctamente');
            transaction.db.close();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }

    }
})();