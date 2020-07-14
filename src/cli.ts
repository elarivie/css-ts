#!/usr/bin/env node

import util from 'util';
import _glob from 'glob';
const glob = util.promisify(_glob);

import * as chokidar from "chokidar";
import * as fs from "fs";
import * as os from 'os';
import * as path from "path";
import * as yargs from 'yargs';
import {extract_classes} from "./util_css";
import {stats, readTextFile, writeTextFile} from "./util_fs";
import {EOL, Quote, buildExportName, to_ts } from './engine';
import {Logger, logger} from "./logger";

// @ts-ignore
const yarg = yargs.usage('$0 [search_path] [options]', 'Create *.css.ts from *.css files.', (yargs: any) => {
		yargs.positional('searchPath', {
			describe: "either a css file path or a folder path from which css file will be looked for using --pattern",
			required: false,
			default: './',
			string: true
		}).strict(true)
		.recommendCommands()
		.detectLocale(false)
		.example('$0 src/index.css', '')
		.example('$0 ./src --pattern "*.css"', '')
		.option('pattern', {
			alias: 'p',
			describe: 'Glob pattern',
			string: true,
			default: '**/*.css',
		})
		.option('stdout', {
			describe: 'Output to stdout instead of to disk',
			boolean: true,
			group: 'Output format',
		})
		.option('stdin', {
			describe: 'Input from stdin instead of using searchPath',
			boolean: true,
			group: 'Output format',
		})
		.option('watch', {
			alias: 'w',
			describe: 'Watch css files',
			boolean: true
		})
		.help(true)
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		.version(require('../package.json').version)
		.option('help', {
			alias: 'h',
			describe: 'Display help and exit',
			boolean: true,
			group: 'Information'
		})
		.option('version', {
			alias: 'V',
			describe: 'Display version and exit',
			boolean: true,
			group: 'Information'
		})

		.option('silent', {
			alias: 's',
			describe: 'Silent verbosity.',
			boolean: true,
			group: 'Verbosity',
		})
		.option('verbose', {
			alias: 'v',
			describe: 'Increase verbosity',
			count: true,
			group: 'Verbosity'
		})
		.option('quiet', {
			alias: 'q',
			describe: 'Decrease verbosity',
			count: true,
			group: 'Verbosity'
		})
		.option('eol', {
			describe: 'Specify the end of line to use (Default to os.EOL)',
			string: true,
			choices: ['\n', '\r\n'],
			default: os.EOL,
			group: 'Output format',
		})
		.option('indent', {
			describe: 'Specify the indentation to use (Default to TAB)',
			string: true,
			default: '\t',
			group: 'Output format'
		})
		.option('quote', {
			describe: 'Specify the quote type to use (Default to \')',
			string: true,
			choices: ['\'', '"'],
			default: '\'',
			group: 'Output format'
		})

		.options('dry-run', {
			boolean: true,
			describe: 'Process everything normally but does not write to disk.'
		})
		.epilog('');
});


export async function main(arg: Array<string>): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		// Parse provided arguments
		// @ts-ignore
		const argv: {
			"$0": string,
			_: Array<string>,
			version: boolean,
			searchPath: string | undefined,
			search_path: string | undefined,
			pattern: string,
			stdout: boolean | undefined,
			verbose: number,
			quiet: number,
			silent: boolean | undefined,
			"dry-run": boolean | undefined,
			eol: EOL,
			indent: string,
			quote: Quote,
			watch: boolean | undefined
		} = yarg.parse(arg);

		// Extract provided arguments
		const verbose_level: number = (argv.silent) ? 0 : Math.max(0, 1 + argv.verbose - argv.quiet);
		const log: Logger = logger(verbose_level);
		
		log?.debug(JSON.stringify(argv), 'Provided arguments: ');

		const stdout: boolean = !!argv.stdout;
		const dryrun: boolean = !!argv["dry-run"];
		const watch: boolean = !!argv.watch;
		const indent: string = argv.indent;
		const eol: EOL = argv.eol;
		const quote: Quote = argv.quote;
		let searchPath: string = argv.search_path || argv.searchPath || "./";
		let searchPattern: string = argv.pattern;
		
		if (dryrun) {
			dryrun && log?.warn("dry-run mode activated...");
		}

		// Process something
				
		async function processAFilePath(filePath_in: string): Promise<void> {
			log?.debug("" + filePath_in, "About to process file...");
			let filePath_out: string | 1;
			if (stdout) {
				filePath_out = 1;
			} else {
				filePath_out = filePath_in + ".ts";
			}

			return readTextFile(filePath_in)
			.then(extract_classes)
			.then(async function (classes: Array<string>) {
				return to_ts(buildExportName(filePath_in), classes, {eol: eol, indent: indent, quote: quote})
				.then((ts_content: string) => {
					if (dryrun && (1 != filePath_out)) {
						log?.info(filePath_out, "Writing to: ");
						log?.info(ts_content, "Content: " + os.EOL);
						return Promise.resolve();
					}
					return writeTextFile(filePath_out, ts_content);
				});
			});
		}
		
		// Glob files
		stats(searchPath)
		.then(async (searchPathstats: null | fs.Stats) => {
			if (searchPathstats?.isFile()) {
				// The searchPath currently points to a specific file so make the searchPath and searchPattern match it
				searchPattern = path.basename(searchPath);
				searchPath = path.dirname(searchPath);
			}

			const filesPattern: string = path.join(searchPath, searchPattern);

			if(!watch) {
				// Process once
				return glob(filesPattern).then(async (files: Array<string>) => {
					log.trace(JSON.stringify(files), "Files to process: ");
					return Promise.all(files.map(processAFilePath))
					.then(() => {
						// Files processing complete
						resolve(0);
						return;
					}).catch((reason: Error) => {
						reject(reason);
						return;
					});
				});
				
			} else {
				// Continuously process
				log?.info(filesPattern, 'Watch ', '...');

				const watcher = chokidar.watch([filesPattern.replace(/\\/g, "/")]);
				watcher.on('add', processAFilePath);
				watcher.on('change', processAFilePath);
				// eslint-disable-next-line no-inner-declarations
				async function waitForever(): Promise<number> {
					return new Promise<number>(() => {});  // eslint-disable-line @typescript-eslint/no-empty-function
				}
				return waitForever();
			}
		});
	}).catch((reason: Error) => {
		throw reason;
	});
}

main(process.argv.slice(2)).then(
	(exit_code) => {process.exit(exit_code);},
	(reason: Error) => {throw reason;}).catch((reason: Error) => {
		process.stderr.write(os.EOL);
		process.stderr.write(reason.message);
		process.stderr.write(os.EOL);
		process.exit(1);
});
