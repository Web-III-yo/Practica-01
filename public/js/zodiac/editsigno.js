// JavaScript Document
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

const txtId = document.querySelector('#txtId');
const txtPosic = document.querySelector('#txtPosic');
const txtSigno = document.querySelector('#txtSigno');
const txtRango = document.querySelector('#txtRango');
const selElemento = document.querySelector('#selElemento');
const txtAstro = document.querySelector('#txtAstro');
const txtPiedra = document.querySelector('#txtPiedra');
const imgActual = document.querySelector('#imgActual');
const txtArchi = document.querySelector('#txtArchi');
const btnUpdate = document.querySelector('#btnUpdate');

let urlImagenActual = '';

const params = new URLSearchParams(window.location.search);
const signoId = params.get('id');

function cargarDatosSigno() {
	if (!signoId) {
		alert('No se seleccionó ningún signo.');
		document.location.href = 'lista.html';
		return;
	}

	db.collection("datosZodiaco").doc(signoId).get()
		.then((doc) => {
			if (!doc.exists) {
				alert('El registro no existe.');
				document.location.href = 'lista.html';
				return;
			}

			const data = doc.data();
			txtId.value = doc.id;
			txtPosic.value = data.posic;
			txtSigno.value = data.signo;
			txtRango.value = data.rango;
			selElemento.value = data.elemento;
			txtAstro.value = data.astro;
			txtPiedra.value = data.piedra;
			urlImagenActual = validarUrlImagen(data.url);
			imgActual.src = urlImagenActual;
		})
		.catch((error) => {
			alert('Error al cargar el signo: ' + error.message);
		});
}

btnUpdate.addEventListener('click', async function () {
	const posic = Number.parseInt(txtPosic.value, 10);
	if (!txtId.value || !Number.isInteger(posic)
		|| !txtSigno.value.trim() || !txtRango.value.trim()
		|| !txtAstro.value.trim() || !txtPiedra.value.trim()) {
		alert('Complete todos los campos obligatorios con valores válidos.');
		return;
	}

	let urlFinal = urlImagenActual;
	const archivo = txtArchi.files[0];

	if (archivo) {
		if (!archivo.type.startsWith('image/')) {
			alert('El archivo seleccionado debe ser una imagen.');
			return;
		}

		const user = auth.currentUser;
		const userId = user ? user.uid : 'anon';
		const nombreUnico = `${userId}_${Date.now()}_${archivo.name}`;
		let uploadResult;

		try {
			uploadResult = await supabaseClient.storage
				.from('archivos')
				.upload(nombreUnico, archivo, {
					contentType: archivo.type
				});
		} catch (error) {
			alert('Error al subir la nueva imagen a Supabase: ' + error.message);
			return;
		}

		if (uploadResult.error) {
			alert('Error al subir la nueva imagen a Supabase: ' + uploadResult.error.message);
			return;
		}

		const { data: urlData } = supabaseClient.storage
			.from('archivos')
			.getPublicUrl(nombreUnico);
		urlFinal = validarUrlImagen(urlData.publicUrl);
	}

	try {
		await db.collection("datosZodiaco").doc(txtId.value).update({
			"posic": posic,
			"signo": txtSigno.value.trim(),
			"rango": txtRango.value.trim(),
			"elemento": selElemento.value,
			"astro": txtAstro.value.trim(),
			"piedra": txtPiedra.value.trim(),
			"url": urlFinal
		});

		alert('Signo actualizado satisfactoriamente.');
		document.location.href = 'lista.html';
	} catch (error) {
		alert('Error al actualizar en Firestore: ' + error.message);
	}
});

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

window.addEventListener('load', cargarDatosSigno);
