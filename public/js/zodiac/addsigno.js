// JavaScript Document
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

const txtPosic = document.querySelector('#txtPosic');
const txtSigno = document.querySelector('#txtSigno');
const txtRango = document.querySelector('#txtRango');
const selElemento = document.querySelector('#selElemento');
const txtAstro = document.querySelector('#txtAstro');
const txtPiedra = document.querySelector('#txtPiedra');
const txtArchi = document.querySelector('#txtArchi');
const btnLoad = document.querySelector('#btnLoad');

btnLoad.addEventListener('click', async function () {
	const archivo = txtArchi.files[0];

	if (!archivo) {
		alert('Debe seleccionar una imagen');
		return;
	}

	if (!archivo.type.startsWith('image/')) {
		alert('El archivo seleccionado debe ser una imagen');
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
		alert('Error subiendo imagen a Supabase: ' + error.message);
		return;
	}

	if (uploadResult.error) {
		alert('Error subiendo imagen a Supabase: ' + uploadResult.error.message);
		return;
	}

	const { data: urlData } = supabaseClient.storage
		.from('archivos')
		.getPublicUrl(nombreUnico);

	try {
		const docRef = await db.collection("datosZodiaco").add({
			"posic": parseInt(txtPosic.value, 10),
			"signo": txtSigno.value,
			"rango": txtRango.value,
			"elemento": selElemento.value,
			"astro": txtAstro.value,
			"piedra": txtPiedra.value,
			"url": urlData.publicUrl
		});

		alert("ID del registro: " + docRef.id);
		limpiar();
	} catch (error) {
		alert("Error al guardar en Firestore: " + error.message);
	}
});

function limpiar() {
	txtPosic.value = '';
	txtSigno.value = '';
	txtRango.value = '';
	selElemento.selectedIndex = 0;
	txtAstro.value = '';
	txtPiedra.value = '';
	txtArchi.value = '';
	txtPosic.focus();
}
