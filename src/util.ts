export type Promised<T> = Promise<T> | T;

/*
 * Check if an object is assigned a value.
*/
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function is(value: any): boolean {
	if (typeof value == "undefined") {
		return false;
	}
	if (isNaN(value)) {
		return true;
	}
	if (value === null) {
		return false;
	}
	return true;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function is_default(value: any, default_value: any): any {
	return is(value) ? value: default_value;
}
