import camelcase from "camelcase";
import * as path from 'path';
import {removeExtension} from "./util_string";
import {Promised} from "./util";

export type Quote = "'" | "\"";
export type EOL = "\r\n" | "\n";

export async function to_ts(exportName: Promised<string>, classes: Promised<Array<string>>, format: Promised<{eol: EOL, indent: string, quote: Quote}>): Promise<string> {
	return Promise.all([exportName, classes, format]).then(([exportName, classes, format]) => {
		const space: string = "\x20";
		const prefix: string[] = [
			`export const ${exportName} = {`,
		];
		const data: string[] = classes.map((value: string, index: number, array: Array<string>) => {return value.slice(1);}).sort().map((value: string, index: number, array: Array<string>) => `${format.indent}${format.quote}${value}${format.quote}:${space}${format.quote}${value}${format.quote}${(array.length - 1===index)? "": ","}`);
		const suffix: string[] = [
			"};",
			`export default ${exportName};`
		];
		return Promise.resolve(Array.prototype.concat(prefix, data, suffix).join(format.eol));
	});
}

/**
 * Build the export name.
 */
export function buildExportName(inputPath: string | 0): string {

	if (0 == inputPath) {
		return "Stdin";
	}
	
	let result: string;
	
	// Get the file name without extension
	// @ts-ignore
	result = (0 === inputPath) ? "stdin" : path.basename(removeExtension(inputPath));
	
	// Change the casing
	result = camelcase(result);

	// Make the first letter uppercase
	result = `${result.charAt(0).toUpperCase()}${result.slice(1)}`;

	return result;
}
