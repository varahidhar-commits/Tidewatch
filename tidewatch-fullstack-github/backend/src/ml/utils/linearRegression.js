const { transpose, matmul, invert } = require("./matrix");

/**
 * Ordinary least squares multiple linear regression, solved via the
 * normal equations: beta = (XtX + λI)^-1 Xt y  (ridge term λ keeps the
 * solve stable when features are correlated or a training set is small).
 *
 * X: number[][]  — rows of feature vectors (no intercept column; added internally)
 * y: number[]    — target values, same length as X
 */
function fitLinearRegression(X, y, ridge = 0.01) {
  const n = X.length;
  const withIntercept = X.map((row) => [1, ...row]);
  const p = withIntercept[0].length;

  const Xt = transpose(withIntercept);
  const XtX = matmul(Xt, withIntercept);
  for (let i = 0; i < p; i++) XtX[i][i] += ridge; // ridge regularization

  const Xty = matmul(Xt, y.map((v) => [v]));
  const XtXinv = invert(XtX);
  const betaMat = matmul(XtXinv, Xty);
  const beta = betaMat.map((r) => r[0]); // [intercept, coef_1, coef_2, ...]

  // in-sample residual std error, used for a rough prediction interval
  const predictions = withIntercept.map((row) => row.reduce((s, x, i) => s + x * beta[i], 0));
  const residuals = y.map((actual, i) => actual - predictions[i]);
  const sse = residuals.reduce((s, r) => s + r * r, 0);
  const stdError = Math.sqrt(sse / Math.max(1, n - p));

  return {
    intercept: beta[0],
    coefficients: beta.slice(1),
    stdError,
    predict(features) {
      return beta[0] + features.reduce((s, x, i) => s + x * beta[i + 1], 0);
    },
  };
}

module.exports = { fitLinearRegression };
