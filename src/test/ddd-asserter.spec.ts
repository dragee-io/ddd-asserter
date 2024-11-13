import { type Report, asserterHandler } from '@dragee-io/type/asserter';
import { describe, expect, test } from 'bun:test';

import dddAsserter from '../..';

describe('DDD Asserter', () => {
    test('assert with no dragees', () => {
        const report: Report = asserterHandler(dddAsserter, []);
        expect(report.pass).toBeTrue();
        expect(report.namespace).toBe('ddd');
    });
});
