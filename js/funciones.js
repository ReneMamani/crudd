function conectarDB(callback) {
    const abrirConexion = window.indexedDB.open('crm', 1);
    abrirConexion.onerror = () => {
        console.log('Hubo un error');
    }
    abrirConexion.onsuccess = () => {
        console.log('Conexion establecida');
        const db = abrirConexion.result;
        if (callback) {
            return callback(db);
        }
    }
}

function imprimirAlerta(msg, tipo) {
    const alerta = document.querySelector('.alerta');
    if (!alerta) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('px-4', 'py-3', 'max-w-lg', 'mx-auto','rounded-md', 'mt-6', 'text-center', 'border', 'alerta');
        if (tipo === 'error') {
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }

        divMensaje.textContent = msg;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}