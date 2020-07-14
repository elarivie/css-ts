import {assert} from 'chai';

import { is, is_default } from '../src/util';

describe('util', () => {
	describe('#is', () => {

		it('works as expected with null', done => {
			assert.isFalse(is(null));
			done();
		});

		it('works as expected with undefined', done => {
			assert.isFalse(is(undefined));
			done();
		});

		it('works as expected with NaN', done => {
			assert.isTrue(is(NaN));
			done();
		});

		it('works as expected with 0', done => {
			assert.isTrue(is(0));
			done();
		});

		it('works as expected with false', done => {
			assert.isTrue(is(false));
			done();
		});

		it('works as expected with true', done => {
			assert.isTrue(is(true));
			done();
		});

		it('works as expected with []', done => {
			assert.isTrue(is([]));
			done();
		});

		it('works as expected with {}', done => {
			assert.isTrue(is({}));
			done();
		});

	});

	describe('#is_default', () => {

		it('works as expected with null', done => {
			const aValueA: string = "XXX";
			assert.isTrue(aValueA === is_default(null, aValueA));
			done();
		});

		it('works as expected with undefined', done => {
			const aValueA: string = "XXX";
			assert.isTrue(aValueA === is_default(undefined, aValueA));
			done();
		});

		it('works as expected with NaN', done => {
			const aValueA: string = "XXX";
			assert.isNaN(is_default(NaN, aValueA));
			done();
		});

		it('works as expected with false', done => {
			const aValueA: string = "XXX";
			const testValue: any = false;
			assert.isTrue(testValue === is_default(testValue, aValueA));
			done();
		});

		it('works as expected with true', done => {
			const aValueA: string = "XXX";
			const testValue: any = true;
			assert.isTrue(testValue === is_default(testValue, aValueA));
			done();
		});

		it('works as expected with []', done => {
			const aValueA: string = "XXX";
			const testValue: any = [];
			assert.isTrue(testValue === is_default(testValue, aValueA));
			done();
		});

		it('works as expected with {}', done => {
			const aValueA: string = "XXX";
			const testValue: any = [];
			assert.isTrue(testValue === is_default(testValue, aValueA));
			done();
		});
	});
});
