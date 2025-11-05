#include <bits/stdc++.h>
using namespace std;

vector<long double> generarCoeficientes(int n) {
    vector<long double> coef = {1.0L};
    for (int i = 1; i <= n; ++i) {
        vector<long double> siguiente(i + 1, 0.0L);
        siguiente[0] = 1.0L;
        siguiente[i] = 1.0L;
        for (int j = 1; j < i; ++j) {
            siguiente[j] = coef[j - 1] + coef[j];
        }
        coef.swap(siguiente);
    }
    return coef; // coef[k] = C(n,k)
}

string mostrarPolinomio(const vector<long double>& coef) {
    int n = (int)coef.size() - 1;
    ostringstream oss;
    oss.setf(ios::fixed); oss<<setprecision(0);
    bool primero = true;
    for (int k = n; k >= 0; --k) {
        long double c = coef[k];
        if (!primero) oss << " + ";
        if (fabsl(c - roundl(c)) < 1e-12L) // entero
            oss << (long long) llround(c);
        else
            oss << c;
        if (k == 1) oss << "*x";
        else if (k > 1) oss << "*x^" << k;
        primero = false;
    }
    return oss.str();
}

pair<long double, vector<string>> evaluarYMostrarPasos(const vector<long double>& coef, long double x) {
    int n = (int)coef.size() - 1;
    long double potencia = 1.0L;
    long double suma = 0.0L;
    vector<string> pasos;
    ostringstream oss;
    for (int k = 0; k <= n; ++k) {
        long double termino = coef[k] * potencia;
        suma += termino;
        oss.str(""); oss.clear();
        oss << "k=" << k << ": C=" << coef[k] << " , x^k=" << potencia << " , termino=" << termino << " , suma_intermedia=" << suma;
        pasos.push_back(oss.str());
        potencia *= x;
    }
    return {suma, pasos};
}

int main(int argc, char** argv) {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    long double x;

    if (argc >= 3) {
        n = stoi(argv[1]);
        x = stold(argv[2]);
    } else {
        cout << "Ingrese un entero no negativo n (grado): ";
        if (!(cin >> n)) return 1;
        if (n < 0) { cerr << "n debe ser no negativo\n"; return 1; }
        cout << "Ingrese el valor x (numero) para evaluar f(x) = (x+1)^n: ";
        if (!(cin >> x)) return 1;
    }

    auto t0 = chrono::high_resolution_clock::now();
    auto coef = generarCoeficientes(n);
    auto pol = mostrarPolinomio(coef);
    auto res = evaluarYMostrarPasos(coef, x);
    auto t1 = chrono::high_resolution_clock::now();

    long double tiempoMs = chrono::duration<long double, milli>(t1 - t0).count();

    cout << "\nCoeficientes (C(" << n << ",k)): \n";
    for (size_t i = 0; i < coef.size(); ++i) cout << coef[i] << (i + 1 < coef.size() ? " " : "\n");

    cout << "\nPolinomio (forma expandida):\n" << pol << "\n\n";

    cout << "Evaluacion paso a paso:\n";
    for (auto &s: res.second) cout << s << "\n";

    cout << "\nResultado final f(" << x << ") = (" << x << "+1)^" << n << " = " << res.first << "\n";
    cout << "Tiempo total (generacion+evaluacion): " << fixed << setprecision(3) << tiempoMs << " ms\n";

    // Guardar tiempo en tiempos.txt
    try {
        ofstream ofs("tiempos.txt", ios::out | ios::app);
        if (ofs) {
            ofs << "C++; n=" << n << "; tiempo_ms=" << fixed << setprecision(3) << tiempoMs << "\n";
        }
    } catch (...) {
        cerr << "No se pudo escribir en tiempos.txt" << endl;
    }

    return 0;
}
