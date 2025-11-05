"use strict";

//si una cadena está en notación científica
function esNotacionCientifica(cadena) {
	const regex = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)[eE][+-]?\d+$/;
	return regex.test(cadena);
}

//si una cadena es una dirección IPv4 válida
function esIP(cadena) {
    //validar direcciones IPv4 en el formato n.n.n.n donde n es un número entre 0 y 255)
	const octeto = '(?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)';
	const regex = new RegExp(`^${octeto}\\.${octeto}\\.${octeto}\\.${octeto}$`);
	return regex.test(cadena);
}

//si una cadena es un correo electrónico razonable
function esCorreo(cadena) {
	const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	return regex.test(cadena);
}

// Función que reconoce el tipo de la cadena
function reconocerTipo(cadena) {
	if (cadena === null || cadena === undefined) return 'Vacío';
	const texto = String(cadena).trim();
	if (texto.length === 0) return 'Vacío';

	if (esNotacionCientifica(texto)) return 'Notación científica';
	if (esIP(texto)) return 'Dirección IP (IPv4)';
	if (esCorreo(texto)) return 'Correo electrónico';

	return 'Desconocido';
}

function main() {
	const args = process.argv.slice(2);

	// Si se proporciona un argumento, se procesa
	if (args.length >= 1) {
		const entrada = args[0];
		const tipo = reconocerTipo(entrada);
		console.log(`Entrada: "${entrada}" --> Tipo reconocido: ${tipo}`);
		return;
	}

	//pedimos la cadena al usuario por consola
	const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question('Introduzca una cadena para reconocer (notación científica / IP / correo): ', (respuesta) => {
		const tipo = reconocerTipo(respuesta);
		console.log(`Tipo reconocido: ${tipo}`);
		rl.close();
	});
}

// Ejecutar main si se ejecuta directamente
if (require.main === module) {
	main();
}
