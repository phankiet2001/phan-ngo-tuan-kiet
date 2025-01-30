
const sumToN = (n) => {
  return n * (n + 1) / 2;
}

// 2.
const sumToN2 = (n) => {
  return Array.from({ length: n }, (_, i) => i + 1).reduce((acc, curr) => acc + curr, 0);
}

// 3.
const sumToN3 = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

console.log(sumToN(5));
console.log(sumToN2(5));
console.log(sumToN3(5));
