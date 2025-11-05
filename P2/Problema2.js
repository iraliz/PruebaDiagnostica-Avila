"use strict";
const fs = require('fs');
const readline = require('readline');

function generarCoeficientes(n) {
  // Usamos BigInt para manejar coeficientes grandes (dinámica: arrays crecidos en cada paso)
  let coef = [1n]; // (x+1)^0
  for (let i = 1; i <= n; i++) {
    const siguiente = new Array(i + 1).fill(0n);
    siguiente[0] = 1n;
    siguiente[i] = 1n;
    for (let j = 1; j < i; j++) {
      siguiente[j] = coef[j - 1] + coef[j];
    }
    coef = siguiente;
  }
  return coef; // coef[k] = C(n,k) for x^k
}

function mostrarPolinomio(coef) {
  const n = coef.length - 1;
  const partes = [];
  // Mostrar de mayor a menor grado
  for (let k = n; k >= 0; k--) {
    const c = coef[k];
    if (c === 0n) continue;
    let termino = c.toString();
    if (k === 0) {
      // término independiente
    } else if (k === 1) {
      termino += "*x";
    } else {
      termino += `*x^${k}`;
    }
    partes.push(termino);
  }
  return partes.join(" + ");
}

function evaluarYMostrarPasos(coef, x) {
  const n = coef.length - 1;
  let xBig = BigInt(x);
  let potencia = 1n; // x^0
  let suma = 0n;
  const pasos = [];
  for (let k = 0; k <= n; k++) {
    const termino = coef[k] * potencia;
    suma += termino;
    pasos.push({k, coef: coef[k], potencia, termino, suma});
    potencia *= xBig;
  }
  return {resultado: suma, pasos};
}

function pedirEntradaYEjecutar() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Ingrese un entero no negativo n (grado): ', (nStr) => {
    const n = Number(nStr);
    if (!Number.isInteger(n) || n < 0) {
      console.error('n debe ser un entero no negativo');
      rl.close();
      return;
    }
    rl.question('Ingrese el valor entero x para evaluar f(x) = (x+1)^n: ', (xStr) => {
      if (!/^[-]?\d+$/.test(xStr)) {
        console.error('x debe ser un entero');
        rl.close();
        return;
      }
      const x = Number(xStr);

      // Medir tiempo total: generación + evaluación
      const tInicio = process.hrtime.bigint();
      const coef = generarCoeficientes(n);
      const pol = mostrarPolinomio(coef);
      const evalRes = evaluarYMostrarPasos(coef, x);
      const tFin = process.hrtime.bigint();

      const tiempoMs = Number(tFin - tInicio) / 1e6;

      console.log(`\nCoeficientes (C(${n},k)):`);
      console.log(coef.map(c => c.toString()).join(' '));

      console.log(`\nPolinomio (forma expandida):\n${pol}\n`);

      console.log('Evaluación paso a paso:');
      evalRes.pasos.forEach(p => {
        console.log(`k=${p.k}: C=${p.coef.toString()} , x^k=${p.potencia.toString()} , término=${p.termino.toString()} , suma_intermedia=${p.suma.toString()}`);
      });

      console.log(`\nResultado final f(${x}) = ( ${x} + 1 )^${n} = ${evalRes.resultado.toString()}`);
      console.log(`Tiempo total (generación+evaluación): ${tiempoMs.toFixed(3)} ms`);

      // Guardar tiempo en archivo tiempos.txt (forma: JS; n=..; tiempo_ms=..)
      const linea = `JavaScript; n=${n}; tiempo_ms=${tiempoMs.toFixed(3)}\n`;
      try {
        fs.appendFileSync('tiempos.txt', linea, {encoding: 'utf8'});
        console.log('Tiempo guardado en tiempos.txt');
      } catch (err) {
        console.error('Error escribiendo tiempos.txt:', err.message);
      }

      rl.close();
    });
  });
}

// Si se pasan argumentos: node Problema2.js n x
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const n = Number(args[0]);
    const x = args[1];
    if (!Number.isInteger(n) || n < 0) {
      console.error('n debe ser un entero no negativo');
      process.exit(1);
    }
    if (!/^[-]?\d+$/.test(x)) {
      console.error('x debe ser un entero');
      process.exit(1);
    }
    const tInicio = process.hrtime.bigint();
    const coef = generarCoeficientes(n);
    const pol = mostrarPolinomio(coef);
    const evalRes = evaluarYMostrarPasos(coef, Number(x));
    const tFin = process.hrtime.bigint();
    const tiempoMs = Number(tFin - tInicio) / 1e6;

    console.log(`\nCoeficientes (C(${n},k)):`);
    console.log(coef.map(c => c.toString()).join(' '));
    console.log(`\nPolinomio (forma expandida):\n${pol}\n`);
    console.log('Evaluación paso a paso:');
    evalRes.pasos.forEach(p => {
      console.log(`k=${p.k}: C=${p.coef.toString()} , x^k=${p.potencia.toString()} , término=${p.termino.toString()} , suma_intermedia=${p.suma.toString()}`);
    });
    console.log(`\nResultado final f(${x}) = ( ${x} + 1 )^${n} = ${evalRes.resultado.toString()}`);
    console.log(`Tiempo total (generación+evaluación): ${tiempoMs.toFixed(3)} ms`);
    const linea = `JavaScript; n=${n}; tiempo_ms=${tiempoMs.toFixed(3)}\n`;
    try { fs.appendFileSync('tiempos.txt', linea, {encoding: 'utf8'}); } catch (err) { console.error('Error escribiendo tiempos.txt:', err.message); }
  } else {
    pedirEntradaYEjecutar();
  }
}
