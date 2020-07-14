import {assert} from 'chai';

import { buildExportName, to_ts } from '../src/engine';

describe('engine', () => {
	describe('#buildExportName', () => {

		it('handle 0', done => {
			const inputPath: 0 = 0 as const;
			const result: string = buildExportName(inputPath);
			const expected: string = "Stdin";
			
			assert.strictEqual(result, expected);
			done();
		});

		it('handle css file path', done => {
			const inputPath: string = "hey.css";
			const result: string = buildExportName(inputPath);
			const expected: string = "Hey";
			
			assert.strictEqual(result, expected);
			done();
		});

		it('handle css file path', done => {
			const inputPath: string = "/var/data/hey.css";
			const result: string = buildExportName(inputPath);
			const expected: string = "Hey";
			
			assert.strictEqual(result, expected);
			done();
		});

	});

	describe('#to_ts', () => {

		it('handle no class', done => {
			const classes: Array<string> = [];
			to_ts("Abc", classes, {eol: "\n", indent: "\t", quote: "'"}).then((ts_content) => {
				const expected: string = "export const Abc = {\n};\nexport default Abc;";
				assert.strictEqual(ts_content, expected);
				done();
			});
		});

		it('handle multi', done => {
			const classes: Array<string> = [".A", ".B"];
			to_ts("Abc", classes, {eol: "\n", indent: "\t", quote: "'"}).then((ts_content) => {
				const expected: string = "export const Abc = {\n\t'A': 'A',\n\t'B': 'B'\n};\nexport default Abc;";
				assert.strictEqual(ts_content, expected);
				done();
			});
		});


		it('handle css file path', done => {
			const inputPath: string = "hey.css";
			const result: string = buildExportName(inputPath);
			const expected: string = "Hey";
			
			assert.strictEqual(result, expected);
			done();
		});

		it('handle css file path', done => {
			const inputPath: string = "/var/data/hey.css";
			const result: string = buildExportName(inputPath);
			const expected: string = "Hey";
			
			assert.strictEqual(result, expected);
			done();
		});

	});

});
