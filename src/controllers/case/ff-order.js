const cache = new Map();

function isDuplicateCall(argsKey) {
  const now = Date.now();
  if (cache.has(argsKey)) {
    const lastCallTime = cache.get(argsKey);
    if (now - lastCallTime < 60000) {
      return true;
    }
  }
  cache.set(argsKey, now);
  return false;
}

const orderFF = async () => {
  if (isDuplicateCall("orderFF")) {
    return "Duplicate call, mohon tunggu beberapa saat.";
  }
};
