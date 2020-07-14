import { extname } from 'path';

export function searchReplaceAll(data: string, search: string, replace: string): string {
	if (0 === data.length) {
		return "";
	}
	return data.split(search).join(replace);
}

export function removeDelimited(data: string, prefix: string, suffix: string): string {
	if (0 === data.length) {
		return "";
	}
	
	while(true) {

		const indexstart: number = data.lastIndexOf(prefix);
		if (indexstart < 0) {
			return data;
		}
		const indexstop: number = data.indexOf(suffix, indexstart + prefix.length) ;
		if (indexstop < 0) {
			return data;
		}
		data = data.slice(0, indexstart) + data.slice(indexstop + suffix.length);
	}
}

export function removeExtension(filePath: string): string {
	return filePath.slice(0, -extname(filePath).length);
}

export default {removeDelimited, searchReplaceAll, removeExtension};
