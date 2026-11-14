// JavaScript Document
var db = firebase.apps[0].firestore();

const tabla = document.querySelector('#tabla');

db.collection("datosZodiaco").orderBy('posic', 'asc').get()
	.then(function (query) {
		tabla.replaceChildren();

		if (query.empty) {
			tabla.textContent = 'No hay signos zodiacales para mostrar.';
			return;
		}

		query.forEach(function (doc) {
			const datos = doc.data();
			const tarjeta = document.createElement('div');
			tarjeta.className = 'divAnuncio m-3';
			tarjeta.tabIndex = 0;
			tarjeta.setAttribute('role', 'button');
			tarjeta.addEventListener('click', function () {
				editarSigno(doc.id);
			});
			tarjeta.addEventListener('keydown', function (event) {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					editarSigno(doc.id);
				}
			});

			const bloqueImagen = document.createElement('div');
			bloqueImagen.className = 'imgBlock';
			const imagen = document.createElement('img');
			imagen.width = 100;
			imagen.style.width = '100%';
			imagen.alt = displayValue(datos.signo);
			imagen.src = validarUrlImagen(datos.url);
			bloqueImagen.appendChild(imagen);
			tarjeta.appendChild(bloqueImagen);

			const detalles = document.createElement('div');
			const titulo = document.createElement('strong');
			titulo.textContent = displayValue(datos.posic) + '. ' + displayValue(datos.signo);
			detalles.appendChild(titulo);
			detalles.appendChild(document.createElement('br'));

			const rango = document.createElement('small');
			rango.textContent = displayValue(datos.rango);
			detalles.appendChild(rango);
			detalles.appendChild(document.createElement('br'));
			agregarDetalle(detalles, 'Elemento:', datos.elemento);
			agregarDetalle(detalles, 'Astro:', datos.astro);
			agregarDetalle(detalles, 'Piedra:', datos.piedra);
			tarjeta.appendChild(detalles);
			tabla.appendChild(tarjeta);
		});
	})
	.catch(function (error) {
		alert('Error al cargar los signos zodiacales: ' + error.message);
	});

function agregarDetalle(contenedor, etiqueta, valor) {
	const detalle = document.createElement('span');
	const nombre = document.createElement('b');
	nombre.textContent = etiqueta + ' ';
	detalle.appendChild(nombre);
	detalle.appendChild(document.createTextNode(displayValue(valor)));
	contenedor.appendChild(detalle);
	contenedor.appendChild(document.createElement('br'));
}

function displayValue(value) {
	return value === undefined || value === null ? '' : String(value);
}

function validarUrlImagen(value) {
	if (!value) {
		return '';
	}

	try {
		const url = new URL(value, window.location.origin);
		return url.protocol === 'https:' || url.protocol === 'http:'
			? url.href
			: '';
	} catch {
		return '';
	}
}

function editarSigno(idDoc) {
	document.location.href = 'editar.html?id=' + encodeURIComponent(idDoc);
}
