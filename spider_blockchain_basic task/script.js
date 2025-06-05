const PRIME = 7919;

function mod(n, p = PRIME) {
    return ((n % p) + p) % p;
}

function randominteger(max) {
    return Math.floor(Math.random() * max);
}

function modInverse(a, p = PRIME) {
    let t = 0, newT = 1;
    let r = p, newR = a;

    while (newR !== 0) {
        let q = Math.floor(r / newR);
        [t, newT] = [newT, t - q * newT];
        [r, newR] = [newR, r - q * newR];
    }

    if (r !== 1) throw new Error("Not invertible");
    return mod(t, p);
}

function generatepolynomial(secret, degree) {
    const coeffs = [secret];
    for (let i = 1; i <= degree; i++) {
        coeffs.push(randominteger(PRIME));
    }
    return coeffs;
}

function evaluatepolynomial(coeffs, x) {
    let result = 0;
    let xPower = 1;
    for (let coeff of coeffs) {
        result = mod(result + coeff * xPower);
        xPower = mod(xPower * x);
    }
    return result;
}

function generateShares(secret, n, k) {
    const coeffs = generatepolynomial(secret, k - 1);
    const shares = [];
    for (let i = 1; i <= n; i++) {
        shares.push({ x: i, y: evaluatepolynomial(coeffs, i) });
    }
    return shares;
}

function lagrangeinterpolation(x, shares) {
    let result = 0;

    for (let i = 0; i < shares.length; i++) {
        const { x: xi, y: yi } = shares[i];

        let li = 1;
        for (let j = 0; j < shares.length; j++) {
            if (i === j) continue;
            const xj = shares[j].x;
            const numerator = mod(x - xj);
            const denominator = mod(xi - xj);
            li = mod(li * numerator * modInverse(denominator));
        }

        result = mod(result + yi * li);
    }

    return result;
}
const secret = 2568;
const n = 6;
const k = 3;
const shares = generateShares(secret, n, k);
console.log("Shares:", shares);
const chosen = shares.slice(1, 4);
console.log("Chosen Shares:", chosen);
const recovered = lagrangeinterpolation(0, chosen);
console.log("Recovered Secret:", recovered);
