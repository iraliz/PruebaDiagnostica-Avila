"use strict";
const readline = require('readline');

function validarFEN(cadena) {
	const resultado = { valido: false };
//es cadena?
	if (typeof cadena !== 'string') {
		resultado.razon = 'La entrada no es una cadena.';
		return resultado;
	}

	//se dividen en 6 partes
	const partes = cadena.trim().split(/\s+/);
	if (partes.length !== 6) {
		resultado.razon = ` ${partes.length}.La FEN debe tener 6 campos separados por espacios, se encontraron`;
		return resultado;
	}

	const [colocacion, turno, enroque, enpassant, medioMovimiento, numeroMovimiento] = partes;

	//Validar colocación de piezas: 8 filas separadas por '/'
	const filas = colocacion.split('/');
	if (filas.length !== 8) {
		resultado.razon = `El campo de piezas debe tener 8 filas separadas por '/', tiene ${filas.length}.`;
		return resultado;
	}

	const filaValidaRegex = /^[pnbrqkPNBRQK1-8]+$/;
	for (let i = 0; i < filas.length; i++) {
		const fila = filas[i];
		if (!filaValidaRegex.test(fila)) {
			resultado.razon = `Fila ${i + 1} contiene caracteres inválidos.`;
			return resultado;
		}

		// Calcular número total de casillas ocupadas en la fila (números cuentan como espacios vacíos)
		let totalCasillas = 0;
		for (const ch of fila) {
			if (/\d/.test(ch)) totalCasillas += parseInt(ch, 10);
			else totalCasillas += 1;
		}

		if (totalCasillas !== 8) {
			resultado.razon = `Fila ${i + 1} debe ocupar exactamente 8 casillas, ocupa ${totalCasillas}.`;
			return resultado;
		}
	}

	//Validar turno: 'w' o 'b'
	if (!/^[wb]$/.test(turno)) {
		resultado.razon = "El campo 'turno' debe ser 'w' o 'b'.";
		return resultado;
	}

	// Validar enroque: '-' o combinación de KQkq sin duplicados
	if (enroque !== '-' && !/^[KQkq]+$/.test(enroque)) {
		resultado.razon = "Campo de enroque inválido (debe ser '-' o combinación de 'KQkq').";
		return resultado;
	}
	if (enroque !== '-') {
		const visto = new Set();
		for (const ch of enroque) {
			if (visto.has(ch)) {
				resultado.razon = 'Campo de enroque contiene letras duplicadas.';
				return resultado;
			}
			visto.add(ch);
		}
	}

	//Validar en-passant: '-' o casilla válida (archivo a-h y fila 3 o 6)
	if (enpassant !== '-' && !/^[a-h][36]$/.test(enpassant)) {
		resultado.razon = "Campo en-passant inválido (debe ser '-' o una casilla como 'e3' o 'h6').";
		return resultado;
	}

	//Validar halfmove clock: entero no negativo
	if (!/^\d+$/.test(medioMovimiento) || Number(medioMovimiento) < 0) {
		resultado.razon = 'Halfmove clock debe ser un entero no negativo.';
		return resultado;
	}

	// Validar fullmove number: entero positivo (>=1)
	if (!/^\d+$/.test(numeroMovimiento) || Number(numeroMovimiento) < 1) {
		resultado.razon = 'Fullmove number debe ser un entero positivo mayor o igual a 1.';
		return resultado;
	}

	//pasa todas las comprobaciones sintácticas, consideramos la FEN válida a nivel sintáctico
	resultado.valido = true;
	return resultado;
}

function MostrarResultado(validacion) {
	if (validacion.valido) {
		console.log('VÁLIDO - La cadena está en notación FEN válida (comprobación sintáctica).');
	} else {
		console.log('INVÁLIDO - La cadena NO está en notación FEN válida. Razón:', validacion.razon);
	}
}

// Si se pasa la FEN como argumento al script, se usa, en caso contrario se pide.
const argumentos = process.argv.slice(2);
if (argumentos.length > 0) {
	const fenEntrada = argumentos.join(' ');
	const validacion = validarFEN(fenEntrada);
	MostrarResultado(validacion);
} else {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	rl.question('Introduce la cadena FEN: ', (respuesta) => {
		const validacion = validarFEN(respuesta);
		MostrarResultado(validacion);
		rl.close();
	});
}

