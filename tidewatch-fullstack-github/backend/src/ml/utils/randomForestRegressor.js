const { buildTree, predictTree } = require("./regressionTree");

/**
 * Random Forest Regressor: bootstrap-sampled, feature-subsampled ensemble
 * of regression trees. Prediction is the mean across trees; the spread
 * across trees doubles as an empirical confidence interval.
 */
function fitRandomForestRegressor(X, y, { nTrees = 25, maxDepth = 6, minLeafSize = 3, featureSubsampleRatio = 0.7 } = {}) {
  const n = X.length;
  const trees = [];
  for (let t = 0; t < nTrees; t++) {
    const sampleX = [], sampleY = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * n); // bootstrap sample, with replacement
      sampleX.push(X[idx]);
      sampleY.push(y[idx]);
    }
    trees.push(buildTree(sampleX, sampleY, { maxDepth, minLeafSize, featureSubsampleRatio }));
  }

  return {
    nTrees,
    predict(features) {
      const preds = trees.map((tree) => predictTree(tree, features));
      const mean = preds.reduce((a, b) => a + b, 0) / preds.length;
      const variance = preds.reduce((s, p) => s + (p - mean) ** 2, 0) / preds.length;
      const std = Math.sqrt(variance);
      return { mean, std, min: Math.min(...preds), max: Math.max(...preds) };
    },
  };
}

module.exports = { fitRandomForestRegressor };
