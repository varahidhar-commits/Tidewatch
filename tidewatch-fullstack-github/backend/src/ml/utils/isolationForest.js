// Isolation Forest (Liu, Ting & Zhou, 2008): anomalies are "few and
// different", so they get isolated by random splits in fewer steps than
// normal points. We build many random isolation trees over feature
// subsamples, then score a point by its average path length across trees.

function isolationSplit(X, idxs, currentHeight, heightLimit) {
  if (currentHeight >= heightLimit || idxs.length <= 1) {
    return { leaf: true, size: idxs.length };
  }
  const nFeatures = X[0].length;
  const feature = Math.floor(Math.random() * nFeatures);

  const values = idxs.map((i) => X[i][feature]);
  const min = Math.min(...values), max = Math.max(...values);
  if (min === max) return { leaf: true, size: idxs.length };

  const splitValue = min + Math.random() * (max - min);
  const left = idxs.filter((i) => X[i][feature] < splitValue);
  const right = idxs.filter((i) => X[i][feature] >= splitValue);
  if (left.length === 0 || right.length === 0) return { leaf: true, size: idxs.length };

  return {
    leaf: false,
    feature,
    splitValue,
    left: isolationSplit(X, left, currentHeight + 1, heightLimit),
    right: isolationSplit(X, right, currentHeight + 1, heightLimit),
  };
}

// average path length of an unsuccessful BST search — used to normalize leaf size
function c(n) {
  if (n <= 1) return 0;
  return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1)) / n;
}

function pathLength(node, point, currentHeight = 0) {
  if (node.leaf) return currentHeight + c(node.size);
  return point[node.feature] < node.splitValue
    ? pathLength(node.left, point, currentHeight + 1)
    : pathLength(node.right, point, currentHeight + 1);
}

function fitIsolationForest(X, { nTrees = 100, sampleSize = Math.min(256, X.length) } = {}) {
  const trees = [];
  const heightLimit = Math.ceil(Math.log2(Math.max(2, sampleSize)));
  for (let t = 0; t < nTrees; t++) {
    const idxs = [];
    for (let i = 0; i < sampleSize; i++) idxs.push(Math.floor(Math.random() * X.length));
    trees.push(isolationSplit(X, idxs, 0, heightLimit));
  }
  const normalizer = c(sampleSize);

  return {
    nTrees,
    // anomaly score in [0,1]; scores near 1 = strongly anomalous, near 0.5 = normal
    score(point) {
      const avgPath = trees.reduce((s, tree) => s + pathLength(tree, point), 0) / trees.length;
      return Math.pow(2, -avgPath / normalizer);
    },
  };
}

module.exports = { fitIsolationForest };
