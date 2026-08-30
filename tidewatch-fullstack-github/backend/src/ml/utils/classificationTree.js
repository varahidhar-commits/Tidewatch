// CART classification tree using Gini impurity, for small labeled
// telemetry/risk datasets (engine risk, etc).

function gini(labels) {
  const counts = {};
  for (const l of labels) counts[l] = (counts[l] || 0) + 1;
  let impurity = 1;
  for (const c of Object.values(counts)) impurity -= (c / labels.length) ** 2;
  return impurity;
}

function majorityWithProbs(labels) {
  const counts = {};
  for (const l of labels) counts[l] = (counts[l] || 0) + 1;
  const total = labels.length;
  const probs = {};
  let best = null, bestCount = -1;
  for (const [label, c] of Object.entries(counts)) {
    probs[label] = c / total;
    if (c > bestCount) { bestCount = c; best = label; }
  }
  return { label: best, probs, n: total };
}

function bestSplit(X, y, featureIdxs) {
  let best = null;
  const parentImpurity = gini(y);

  for (const f of featureIdxs) {
    const values = [...new Set(X.map((row) => row[f]))].sort((a, b) => a - b);
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2;
      const leftY = [], rightY = [];
      for (let r = 0; r < X.length; r++) (X[r][f] <= threshold ? leftY : rightY).push(y[r]);
      if (leftY.length === 0 || rightY.length === 0) continue;

      const weighted = (leftY.length / y.length) * gini(leftY) + (rightY.length / y.length) * gini(rightY);
      const gain = parentImpurity - weighted;
      if (!best || gain > best.gain) best = { feature: f, threshold, gain };
    }
  }
  return best;
}

function buildClassificationTree(X, y, { maxDepth = 5, minLeafSize = 3, featureSubsampleRatio = 1, depth = 0 } = {}) {
  if (depth >= maxDepth || y.length < minLeafSize * 2 || gini(y) < 1e-6) {
    return { leaf: true, ...majorityWithProbs(y) };
  }

  const nFeatures = X[0].length;
  let featureIdxs = [...Array(nFeatures).keys()];
  if (featureSubsampleRatio < 1) {
    const k = Math.max(1, Math.round(nFeatures * featureSubsampleRatio));
    featureIdxs = featureIdxs.sort(() => Math.random() - 0.5).slice(0, k);
  }

  const split = bestSplit(X, y, featureIdxs);
  if (!split || split.gain <= 0) return { leaf: true, ...majorityWithProbs(y) };

  const leftX = [], leftY = [], rightX = [], rightY = [];
  for (let r = 0; r < X.length; r++) {
    if (X[r][split.feature] <= split.threshold) { leftX.push(X[r]); leftY.push(y[r]); }
    else { rightX.push(X[r]); rightY.push(y[r]); }
  }
  if (leftY.length < minLeafSize || rightY.length < minLeafSize) {
    return { leaf: true, ...majorityWithProbs(y) };
  }

  return {
    leaf: false,
    feature: split.feature,
    threshold: split.threshold,
    left: buildClassificationTree(leftX, leftY, { maxDepth, minLeafSize, featureSubsampleRatio, depth: depth + 1 }),
    right: buildClassificationTree(rightX, rightY, { maxDepth, minLeafSize, featureSubsampleRatio, depth: depth + 1 }),
  };
}

function predictClassificationTree(node, features) {
  if (node.leaf) return node.probs;
  return features[node.feature] <= node.threshold
    ? predictClassificationTree(node.left, features)
    : predictClassificationTree(node.right, features);
}

module.exports = { buildClassificationTree, predictClassificationTree, gini };
