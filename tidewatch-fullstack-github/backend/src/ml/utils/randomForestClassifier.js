const { buildClassificationTree, predictClassificationTree } = require("./classificationTree");

function fitRandomForestClassifier(X, y, { nTrees = 25, maxDepth = 5, minLeafSize = 3, featureSubsampleRatio = 0.7 } = {}) {
  const n = X.length;
  const trees = [];
  for (let t = 0; t < nTrees; t++) {
    const sampleX = [], sampleY = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * n);
      sampleX.push(X[idx]);
      sampleY.push(y[idx]);
    }
    trees.push(buildClassificationTree(sampleX, sampleY, { maxDepth, minLeafSize, featureSubsampleRatio }));
  }

  return {
    nTrees,
    predict(features) {
      const votes = {};
      for (const tree of trees) {
        const probs = predictClassificationTree(tree, features);
        for (const [label, p] of Object.entries(probs)) votes[label] = (votes[label] || 0) + p;
      }
      const total = Object.values(votes).reduce((a, b) => a + b, 0);
      const probs = {};
      let best = null, bestP = -1;
      for (const [label, v] of Object.entries(votes)) {
        probs[label] = v / total;
        if (probs[label] > bestP) { bestP = probs[label]; best = label; }
      }
      return { label: best, confidence: bestP, probs };
    },
  };
}

module.exports = { fitRandomForestClassifier };
