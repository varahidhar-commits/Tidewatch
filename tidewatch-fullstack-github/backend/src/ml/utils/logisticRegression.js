// Binary logistic regression trained by gradient descent. Features should
// be normalized by the caller (z-score or 0-1 scaling) for stable convergence.

function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

function fitLogisticRegression(X, y, { epochs = 800, lr = 0.15, l2 = 0.01 } = {}) {
  const n = X.length, p = X[0].length;
  let weights = new Array(p).fill(0);
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    const gradW = new Array(p).fill(0);
    let gradB = 0;
    for (let i = 0; i < n; i++) {
      const z = bias + X[i].reduce((s, x, j) => s + x * weights[j], 0);
      const pred = sigmoid(z);
      const err = pred - y[i];
      for (let j = 0; j < p; j++) gradW[j] += err * X[i][j];
      gradB += err;
    }
    for (let j = 0; j < p; j++) weights[j] -= lr * (gradW[j] / n + l2 * weights[j]);
    bias -= lr * (gradB / n);
  }

  return {
    weights,
    bias,
    predictProba(features) {
      const z = bias + features.reduce((s, x, j) => s + x * weights[j], 0);
      return sigmoid(z);
    },
    // per-feature contribution to the logit, for explainability
    contributions(features) {
      return features.map((x, j) => x * weights[j]);
    },
  };
}

module.exports = { fitLogisticRegression, sigmoid };
