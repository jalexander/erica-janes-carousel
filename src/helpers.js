export function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

export function $on(target, type, callback) {
  target.addEventListener(type, callback);
}
