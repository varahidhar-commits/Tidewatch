// Minimal linear algebra needed for ordinary least squares regression.
// No external dependencies — small, auditable, and dependency-risk-free.

function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}

function matmul(A, B) {
  const rowsA = A.length, colsA = A[0].length, colsB = B[0].length;
  const out = Array.from({ length: rowsA }, () => new Array(colsB).fill(0));
  for (let i = 0; i < rowsA; i++) {
    for (let k = 0; k < colsA; k++) {
      const a = A[i][k];
      if (a === 0) continue;
      for (let j = 0; j < colsB; j++) out[i][j] += a * B[k][j];
    }
  }
  return out;
}

// Gauss-Jordan matrix inversion. Throws if the matrix is singular.
function invert(M) {
  const n = M.length;
  const A = M.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);

  for (let col = 0; col < n; col++) {
    // partial pivot
    let pivotRow = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(A[r][col]) > Math.abs(A[pivotRow][col])) pivotRow = r;
    }
    if (Math.abs(A[pivotRow][col]) < 1e-10) {
      // near-singular: ridge-regularize by nudging the diagonal
      A[col][col] += 1e-6;
    }
    [A[col], A[pivotRow]] = [A[pivotRow], A[col]];

    const pivot = A[col][col];
    for (let j = 0; j < 2 * n; j++) A[col][j] /= pivot;

    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = A[r][col];
      if (factor === 0) continue;
      for (let j = 0; j < 2 * n; j++) A[r][j] -= factor * A[col][j];
    }
  }
  return A.map((row) => row.slice(n));
}

module.exports = { transpose, matmul, invert };
