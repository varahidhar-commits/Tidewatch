// A compact CART regression tree: recursively splits on the feature/threshold
// that most reduces target variance, until max depth or a min-leaf-size floor.

function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
function variance(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
}

function bestSplit(X, y, featureIdxs) {
  let best = null; // { feature, threshold, gain }
  const parentVar = variance(y) * y.length;

  for (const f of featureIdxs) {
    const values = [...new Set(X.map((row) => row[f]))].sort((a, b) => a - b);
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2;
      const leftY = [], rightY = [];
      for (let r = 0; r < X.length; r++) (X[r][f] <= threshold ? leftY : rightY).push(y[r]);
      if (leftY.length === 0 || rightY.length === 0) continue;

      const childVar = variance(leftY) * leftY.length + variance(rightY) * rightY.length;
      const gain = parentVar - childVar;
      if (!best || gain > best.gain) best = { feature: f, threshold, gain };
    }
  }
  return best;
}

function buildTree(X, y, { maxDepth = 6, minLeafSize = 3, featureSubsampleRatio = 1, depth = 0 } = {}) {
  if (depth >= maxDepth || y.length < minLeafSize * 2 || variance(y) < 1e-6) {
    return { leaf: true, value: mean(y), n: y.length };
  }

  const nFeatures = X[0].length;
  let featureIdxs = [...Array(nFeatures).keys()];
  if (featureSubsampleRatio < 1) {
    const k = Math.max(1, Math.round(nFeatures * featureSubsampleRatio));
    featureIdxs = featureIdxs.sort(() => Math.random() - 0.5).slice(0, k);
  }

  const split = bestSplit(X, y, featureIdxs);
  if (!split || split.gain <= 0) return { leaf: true, value: mean(y), n: y.length };

  const leftX = [], leftY = [], rightX = [], rightY = [];
  for (let r = 0; r < X.length; r++) {
    if (X[r][split.feature] <= split.threshold) { leftX.push(X[r]); leftY.push(y[r]); }
    else { rightX.push(X[r]); rightY.push(y[r]); }
  }
  if (leftY.length < minLeafSize || rightY.length < minLeafSize) {
    return { leaf: true, value: mean(y), n: y.length };
  }

  return {
    leaf: false,
    feature: split.feature,
    threshold: split.threshold,
    left: buildTree(leftX, leftY, { maxDepth, minLeafSize, featureSubsampleRatio, depth: depth + 1 }),
    right: buildTree(rightX, rightY, { maxDepth, minLeafSize, featureSubsampleRatio, depth: depth + 1 }),
  };
}

function predictTree(node, features) {
  if (node.leaf) return node.value;
  return features[node.feature] <= node.threshold
    ? predictTree(node.left, features)
    : predictTree(node.right, features);
}

module.exports = { buildTree, predictTree, mean, variance };
