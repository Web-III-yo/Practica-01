// JavaScript Document
var auth = firebase.apps[0].auth();

function validar() {
	var uid = -1;
	auth.onAuthStateChanged((user) => {
		if (user) {
			uid = user.uid;
		} else {
			document.location.href = 'login.html';
		}
	});
	return uid;
}

function salir(){
	auth.signOut().then(() => {
		document.location.href = 'login.html';
	}).catch((error)=>{
	   alert('Error al cerrar la sesión: ' + error.message);
	});
}

// Control de inactividad de 3 minutos (180,000 ms) para páginas de signos zodiacales
function iniciarControlInactividad() {
	let temporizador;
	const TIEMPO_LIMITE = 3 * 60 * 1000;

	function reiniciarTemporizador() {
		clearTimeout(temporizador);
		temporizador = setTimeout(() => {
			alert('Sesión cerrada por 3 minutos de inactividad.');
			salir();
		}, TIEMPO_LIMITE);
	}

	window.addEventListener('mousemove', reiniciarTemporizador);
	window.addEventListener('mousedown', reiniciarTemporizador);
	window.addEventListener('keypress', reiniciarTemporizador);
	window.addEventListener('scroll', reiniciarTemporizador);
	window.addEventListener('touchstart', reiniciarTemporizador);

	reiniciarTemporizador();
}