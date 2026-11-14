// JavaScript Document
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

const txtNombre = document.querySelector('#txtNombre');
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');
const btnInsUser = document.querySelector('#btnInsUser');

btnInsUser.addEventListener('click', function () {
	auth.createUserWithEmailAndPassword(txtEmail.value, txtContra.value)
		.then((userCredential) => {
			const user = userCredential.user;
			const fechaActual = new Date();
			db.collection("datosUsuarios").add({
				"idemp": user.uid,
				"usuario": txtNombre.value,
				"email": user.email,
				"fechaCreacion": fechaActual,
				"ultAcceso": fechaActual
			}).then(function (docRef) {
				alert("Usuario agregado satisfactoriamente");
				limpiar();
			}).catch(function (FirebaseError) {
				alert("Error al registrar datos del usuario: " + FirebaseError);
			});
		})
		.catch((error) => {
			alert("Error al agregar el nuevo usuario: " + error.message);
		});
});

function limpiar(){
	txtNombre.value = '';
	txtEmail.value = '';
	txtContra.value = '';
	txtNombre.focus();
}
