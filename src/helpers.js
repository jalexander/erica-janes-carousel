/**
 * querySelector wrapper
 *
 */
export function qs(selector, scope) {
	return (scope || document).querySelector(selector);
}

/**
 * addEventListener wrapper
 *
 */
export function $on(target, type, callback, capture) {
	target.addEventListener(type, callback, !!capture);
}
