'use strict';

const mapaTraducciones = {
	"printf": "imprimirf",
    "include": "incluir",
	"int": "entero",
	"float": "flotante",
	"double": "doble",
	"char": "caracter",
	"void": "vacío",
	"short": "corto",
	"long": "largo",
	"signed": "conSigno",
	"unsigned": "sinSigno",
	"const": "constante",
	"volatile": "volatil",
	"static": "estatico",
	"auto": "automatico",
	"register": "registro",
	"if": "si",
	"else": "sino",
	"for": "para",
	"while": "mientras",
	"do": "hacer",
	"switch": "intercambia",
	"case": "caso",
	"default": "porDefecto",
	"break": "romper",
	"continue": "continuar",
	"return": "retornar",
	"goto": "irA",
	"struct": "estructura",
	"union": "union",
	"enum": "enumeracion",
	"typedef": "tipoDefinido",
	"sizeof": "tamano_de",
	"extern": "externo",
	"inline": "enLinea",
	"restrict": "restringir",
	"bool": "booleano",
	"true": "verdadero",
	"false": "falso",
	"main": "principal"
};

function esLetraOUnderscore(ch) {
	return /[A-Za-z_]/.test(ch);
}

function esAlfanumericoOUnderscore(ch) {
	return /[A-Za-z0-9_]/.test(ch);
}

function estaEscapado(cadena, indice) {
	// cuenta barras invertidas precedentes para determinar si el carácter está escapado
	let contador = 0;
	for (let k = indice - 1; k >= 0; k--) {
		if (cadena[k] === '\\') contador++; else break;
	}
	return (contador % 2) === 1;
}

function traducirCodigo(codigo) {
	let resultado = '';
	const n = codigo.length;
	let i = 0;
	let estado = 'normal'; // normal, comentarioLinea, comentarioBloque, cadenaDoble, cadenaSimple

	while (i < n) {
		const ch = codigo[i];

		if (estado === 'normal') {
			// detecta inicio de comentario // o /*
			if (ch === '/' && i + 1 < n && codigo[i + 1] === '/') {
				resultado += '//';
				i += 2;
				estado = 'comentarioLinea';
				continue;
			}
			if (ch === '/' && i + 1 < n && codigo[i + 1] === '*') {
				resultado += '/*';
				i += 2;
				estado = 'comentarioBloque';
				continue;
			}

			// detecta inicio de cadenas
			if (ch === '"') {
				resultado += '"';
				i++;
				estado = 'cadenaDoble';
				continue;
			}
			if (ch === "'") {
				resultado += "'";
				i++;
				estado = 'cadenaSimple';
				continue;
			}

			// detecta identificadores (palabras que pueden ser palabras reservadas)
			if (esLetraOUnderscore(ch)) {
				let j = i + 1;
				while (j < n && esAlfanumericoOUnderscore(codigo[j])) j++;
				const token = codigo.slice(i, j);
				if (Object.prototype.hasOwnProperty.call(mapaTraducciones, token)) {
					resultado += mapaTraducciones[token];
				} else {
					resultado += token;
				}
				i = j;
				continue;
			}

			//copia el carácter
			resultado += ch;
			i++;
			continue;
		}

		if (estado === 'comentarioLinea') {
			resultado += ch;
			i++;
			if (ch === '\n') estado = 'normal';
			continue;
		}

		if (estado === 'comentarioBloque') {
			// termina en */
			if (ch === '*' && i + 1 < n && codigo[i + 1] === '/') {
				resultado += '*/';
				i += 2;
				estado = 'normal';
			} else {
				resultado += ch;
				i++;
			}
			continue;
		}

		if (estado === 'cadenaDoble') {
			resultado += ch;
			if (ch === '"' && !estaEscapado(codigo, i)) {
				estado = 'normal';
			}
			i++;
			continue;
		}

		if (estado === 'cadenaSimple') {
			resultado += ch;
			if (ch === "'" && !estaEscapado(codigo, i)) {
				estado = 'normal';
			}
			i++;
			continue;
		}
	}

	return resultado;
}

function procesarEntradaYTraducir(codigoOriginal) {
	// carga dinámica en memoria (string)
	const codigoTraducido = traducirCodigo(codigoOriginal);
	return codigoTraducido;
}

function leerStdinCompleto(callback) {
	// si hay redirección, process.stdin.isTTY será false; leemos hasta 'end'
	if (!process.stdin.isTTY) {
		let datos = '';
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', chunk => datos += chunk);
		process.stdin.on('end', () => callback(datos));
		return;
	}

	// pedimos al usuario pegar el código y terminar con EOF en una línea
	const readline = require('readline');
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	console.log('Pegue el código en C y termine con una línea que contenga sólo: EOF');
	let lineas = [];
	rl.on('line', (line) => {
		if (line === 'EOF') {
			rl.close();
		} else {
			lineas.push(line + '\n');
		}
	});
	rl.on('close', () => callback(lineas.join('')));
}

if (require.main === module) {
	leerStdinCompleto((codigo) => {
		if (!codigo || codigo.trim().length === 0) {
			console.log('// No se recibió código. Ejemplo de uso:');
			console.log("// echo 'int main() { return 0; }' | node Problema4.js");
			return;
		}
		const traducido = procesarEntradaYTraducir(codigo);
		process.stdout.write(traducido);
	});
}

