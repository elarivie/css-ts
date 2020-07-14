import {assert} from 'chai';

import { extract_classes } from '../src/util_css';

describe('util_css', () => {
	describe.each([".", "#"])('#extract_classes handle classname and ids', (prefix: string) => {

		it('handle empty string', done => {
			Promise.resolve('')
			.then(extract_classes)
			.then((value: Array<string>) => {
				assert.isArray(value);
				assert.strictEqual(value.length, 0);
				assert.deepEqual(value.sort(), [].sort());
				done();
			}).catch((reason: Error) => {
				assert.fail(reason?.message);
				done();
			});
		});

		it('handle different kind of casing', done => {
			const classPrefix: string = ".";
			const idPrefix: string = "#";
			const prefixes: Array<string> = [classPrefix, idPrefix];
			const casings: Array<string> = ["UPPER", "lower", "Keb-ab", "CamelUpper", "camelLower"];
			
			const fixtures: Array<Promise<any>> = [];
			
			prefixes.forEach((prefix: string, index:number, array: Array<string>) => {
				casings.forEach((name: string, index:number, array: Array<string>) => {
					fixtures.push(
						Promise.resolve(`${prefix}${name} {color: yellow}`)
						.then(extract_classes)
						.then((value: Array<string>)=> {
							assert.isArray(value);
							assert.strictEqual(value.length, 1);
							assert.strictEqual(value[0], `${prefix}${name}`);
						}));
				});
			});
			Promise.all(fixtures).then((value: Array<string>) => {
				done();
			});
		});
		
		it('detects multi class#0', done => {
			Promise.resolve(`.CLASSA{color: pink;}\r\n.CLASSB{color: purple;}`)
			.then(extract_classes)
			.then((value: Array<string>) => {
				assert.isArray(value);
				assert.deepEqual(value.sort(), [".CLASSA", ".CLASSB"].sort());
				assert.strictEqual(value.length, 2);
				done();
			});
		});

		it('detects multi class#1', done => {
			Promise.resolve(`.A {color: brown;} .C {color: orange;}`)
			.then(extract_classes)
			.then((value: Array<string>) => {
				assert.isArray(value);
				assert.deepEqual(value.sort(), [".A", ".C"].sort());
				assert.strictEqual(value.length, 2);
				done();
			});
		});

		it('handle commented out stuff', done => {
			Promise.resolve('.A {color: brown;}/*.B {color: black;}*/ .C {color: orange;}')
			.then(extract_classes)
			.then((value: Array<string>) => {
				assert.isArray(value);
				assert.deepEqual(value.sort(), [".A", ".C"].sort());
				done();
			});

		});

		it('handle commented out stuff', done => {
			Promise.resolve('body {\r\n\tbackground-color: #FFFFFF;\n\tcolor: #000000;\n\tfont: 100% Helvetica, sans-serif; }')
			.then(extract_classes)
			.then((value: Array<string>) => {
				assert.isArray(value);
				assert.deepEqual(value.sort(), [].sort());
				assert.strictEqual(value.length, 0);
				done();
			});
		});
	});
});
