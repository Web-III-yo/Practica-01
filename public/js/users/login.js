// JavaScript Document
var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');
const btnLogin = document.querySelector('#btnLogin');

btnLogin.addEventListener('click', function () {
	auth.signInWithEmailAndPassword(txtEmail.value, txtContra.value)
		.then((userCredential) => {
			const user = userCredential.user;
			const dt = new Date();
			db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
				.then(function (docRef) {
					if (docRef.empty) {
						alert("No se encontraron datos para el usuario autenticado.");
						return;
					}

					Promise.all(docRef.docs.map(function (doc) {
						return doc.ref.update({ ultAcceso: dt });
					})).then(function () {
						document.location.href = 'index.html';
					}).catch(function (FirebaseError) {
						alert("Error updating document: " + FirebaseError);
					});
				})
				.catch(function (FirebaseError) {
					alert("Error updating document: " + FirebaseError);
				});
		})
		.catch((error) => {
			alert("Error user access: " + error.message);
		});
});
