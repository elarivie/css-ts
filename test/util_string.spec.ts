import {assert} from 'chai';

import { searchReplaceAll, removeDelimited, removeExtension } from '../src/util_string';

describe('util_string', () => {
	describe('#searchReplaceAll', () => {

		it('handle replace everywhere in a string', done => {
			const before: string = "AbcdAeafgA";
			const result: string = searchReplaceAll(before, "A", 'B');
			const expected: string = "BbcdBeafgB";
			
			assert.strictEqual(result, expected);
			done();
		});

		it('handle replace in empty data', done => {
			const before: string = "";
			const result: string = searchReplaceAll(before, "A", 'B');
			const expected: string = "";
			
			assert.strictEqual(result, expected);
			done();
		});

		it('handle replace by empty string', done => {
			const before: string = "AbcdAeafgA";
			const result: string = searchReplaceAll(before, "A", '');
			const expected: string = "bcdeafg";
			
			assert.strictEqual(result, expected);
			done();
		});

		it('handle replace by itself', done => {
			const before: string = "AAA";
			const result: string = searchReplaceAll(before, "AA", 'AA');
			const expected: string = "AAA";
			
			assert.strictEqual(result, expected);
			done();
		});

	});

	describe('#removeDelimited', () => {

		it('works', done => {
			const before: string = "ABCDEFGHIJKLMN";
			const result: string = removeDelimited(before, "F", 'J');
			const expected: string = "ABCDEKLMN";
			assert.strictEqual(result, expected);
			done();
		});

		it('works with css comments #0', done => {
			const before: string = "AB/*XYZ*/CD";
			const result: string = removeDelimited(before, "/*", '*/');
			const expected: string = "ABCD";
			assert.strictEqual(result, expected);
			done();
		});

		it('works if only the prefix of the delimiter is present', done => {
			const before: string = "AB/*XYZCD";
			const result: string = removeDelimited(before, "/*", '*/');
			const expected: string = "AB/*XYZCD";
			assert.strictEqual(result, expected);
			done();
		});


		it('works with css comments #1', done => {
			const before: string = ".A {color: brown;}/*.B {color: black;}*/ .C {color: orange;}";
			const result: string = removeDelimited(before, "/*", '*/');
			const expected: string = ".A {color: brown;} .C {color: orange;}";
			assert.strictEqual(result, expected);
			done();
		});

		it('works if there are multiple time the delimiter', done => {
			const before: string = "X{A}{B}{C}{D}{E}YZ{}";
			const result: string = removeDelimited(before, "{", '}');
			const expected: string = "XYZ";
			assert.strictEqual(result, expected);
			done();
		});

		it('works if there are multiple time the delimiter in each other', done => {
			const before: string = "{}a{}{X{{A}}{{B}}{{C}}{{D}{E}YZ}{}}{}b{}";
			const result: string = removeDelimited(before, "{", '}');
			const expected: string = "ab";
			assert.strictEqual(result, expected);
			done();
		});

	});

	describe('#removeExtension', () => {

		it('handle *.css', done => {
			const before: string = "index.css";
			const result: string = removeExtension(before);
			const expected: string = "index";
			
			assert.strictEqual(result, expected);
			done();
		});

		it('handle *.css with path', done => {
			const before: string = "/var/data/index.css";
			const result: string = removeExtension(before);
			const expected: string = "/var/data/index";
			
			assert.strictEqual(result, expected);
			done();
		});

		it('handle *.css.ts', done => {
			const before: string = "index.css.ts";
			const result: string = removeExtension(before);
			const expected: string = "index.css";
			
			assert.strictEqual(result, expected);
			done();
		});

	});

});
