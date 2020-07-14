import * as fs from "fs";
import {Promised} from "./util";

/*
 * Get entry element status.
*/
export async function stats(aPath: Promised<string>): Promise<fs.Stats | null> {

	return Promise.all([aPath]).then(([aPath]) => {
		try	{
			return fs.statSync(aPath);
		}
		catch (e) {
			if (e.code == 'ENOTDIR') { // The path to the entry does not exist
				return null;
			}
			if (e.code == 'ENOENT') { // no such file or directory. File does not exist
				return null;
			}
			throw e; // something went wrong…
		}
	});
}

/*
 * Read a utf-8 encoded text file on disk or read from stdin if path is 0
*/
export async function readTextFile(filePath: Promised<string | 0>): Promise<string> {
	return new Promise<string>((resolve: (value?: string | PromiseLike<string> | undefined) => void, reject: (reason?: any)=> void) => {
		Promise.all([filePath]).then(([filePath]) => {
			fs.readFile(filePath, {encoding: "utf-8", flag: "r"}, (err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		});
	});
}

/*
 * Write a utf-8 encoded text file on disk or to stdout/stderr if filePath is a file number
*/
export async function writeTextFile(filePath: Promised<string | 1 | 2>, data: Promised<string>, encoding: Promised<"utf-8"> = "utf-8"): Promise<void> {
	return new Promise<void>((resolve: (value?: void | PromiseLike<void> | undefined) => void, reject: (reason?: any) => void) => {
		Promise.all([filePath, data]).then(([filePath, data]) => {
			fs.writeFile((1 == filePath) ? 1 : filePath, data, {encoding: "utf-8", flag: "w"}, (err) => {
				if (err) {
					reject(err);
				}
				resolve();
			});
		});
	});
}
