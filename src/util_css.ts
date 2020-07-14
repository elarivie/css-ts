import {Promised} from "./util";
import { removeDelimited } from './util_string';

export const classnamePrefix: string = ".";
export const idPrefix: string = "#";

const nameExtractorRegex: RegExp = new RegExp(`(\\${classnamePrefix}|\\${idPrefix})([-_a-zA-Z0-9]|[\\u00A0-\\u10FFFF])+`, "g");

/*
* Extract the list of class names and ids.
* The extracted value have their type prefix.
*/
export function extractClassIdList(css: string): Array<string> {
	//// Remove non-relevant context
	// 0- Remove comments context
	css = removeDelimited(css, "/*", "*/");


	// 1- Remove blocks context
	css = removeDelimited(css, "{", "}");
	//// extract class names and IDs (with their prefix)

	const detected_names: RegExpMatchArray | null = css.match(nameExtractorRegex);
	return (null === detected_names) ? [] : detected_names.filter((v, i, a) => a.indexOf(v) === i);
}

export async function extract_classes(css_content: Promised<string>): Promise<Array<string>> {
	return Promise.all([css_content]).then(([css_content]) => {
		return extractClassIdList(css_content);
	});
}
