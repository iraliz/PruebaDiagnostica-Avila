
## 1) Notación FEN
- Valida los 6 campos de una FEN: colocación de piezas, turno, enroque, en-passant, halfmove y fullmove.
- Comprueba formato de filas (cada fila suma 8 casillas), validez del campo turno ('w' o 'b'), formato de enroque, en-passant y los contadores.

Requisitos

- Node.js (12+).

Uso

```powershell
node .\P1\Problema1.js
```

---

## 2) Problema 2 — Polinomio

Genera los coeficientes de (x+1)^n usando el triángulo de Pascal con memoria dinámica. Muestra el polinomio expandido, la evaluación paso a paso para un x dado y mide el tiempo (generación + evaluación).

Ejemplos de ejecución (PowerShell)

```powershell
# JavaScript (interactivo o con argumentos)
node P2/Problema2.js
node P2/Problema2.js 5 2

# C++ (compilar y ejecutar)
g++ -std=c++17 P2/Problema2.cpp -O2 -o P2\Problema2.exe
.\P2\Problema2.exe 5 2
```

Archivo de tiempos

`tiempos.txt` almacena líneas con el formato:

```
<Lenguaje>; n=<valor>; tiempo_ms=<valor>
```
Estos datos se guardan automaticamente luego de hacer las pruebas.

## PRoblema 3 - Reconocimiento de Cadenas

Requisitos

- Node.js (12+)

Ejecución

Se puede ejecutar `node .\P3\Problema3.js` y el programa dará el mensaje para que el usuario ingrese la cadena a validar.

Por otro lado, se puede ejecutar con una cadena como argumento:

```powershell
node .\Problema3.js "1.23e-4"
node .\Problema3.js "192.168.0.1"
node .\Problema3.js "usuario@example.com"
```

El programa imprimirá el tipo reconocido, ya sea IPv4, correo electrónico o notación científica.

## 4) Problema 4 — Traducción de palabras reservadas de C

- Reemplaza palabras reservadas del lenguaje C por su equivalente en español. El programa lee código C desde stdin (pipe/redirección) o en modo interactivo (pegar varias líneas y terminar con una línea que contenga sólo `EOF`).

Requisitos

- Node.js (12+).

Uso

```powershell
# Modo pipe (una línea o multillínea desde otro comando):
echo 'código' | node .\P4\Problema4.js

# Modo interactivo: pega el código C y termina con una línea que contenga sólo EOF
node .\P4\Problema4.js
# código C
# EOF
```

Ejemplos

- Pipe (PowerShell):

```powershell
echo 'int main() { return 0; }' | node .\P4\Problema4.js
# salida esperada: entero principal() { retornar 0; }
```

Nota

- El traductor evita cambiar texto dentro de cadenas simples/dobles y comentarios (`//` y `/* ... */`).

