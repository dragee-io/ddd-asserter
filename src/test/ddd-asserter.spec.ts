import { describe, expect, test } from 'bun:test';
import { type Report, asserterHandler } from '@dragee-io/type/asserter';
import type { Dragee } from '@dragee-io/type/common';

import dddAsserter from '../..';

interface TestObject {
    dragees: Dragee[];
    result: {
        pass: boolean;
        errors: string[];
    };
}

function rulePassed(drageeDirectory: string) {
    test('Rule passed', () => {
        const data: TestObject = require(drageeDirectory);
        const report = asserterHandler(dddAsserter, data.dragees);
        expect(report.pass).toBe(data.result.pass);
    });
}

function ruleFailed(drageeDirectory: string) {
    test('Rule failed', () => {
        const data: TestObject = require(drageeDirectory);
        const report = asserterHandler(dddAsserter, data.dragees);

        expect(report.pass).toBe(data.result.pass);
        for (const error of data.result.errors) {
            expect(JSON.stringify(report.errors)).toContain(JSON.stringify(error));
        }
    });
}

describe('DDD Asserter', () => {
    test('assert with no dragees', () => {
        const report: Report = asserterHandler(dddAsserter, []);
        expect(report.pass).toBeTrue();
        expect(report.namespace).toBe('ddd');
    });

    describe('Aggregate Rules', () => {
        const AGGREGATE_DEPENDENCY_DRAGEE_TEST_DIRECTORY = './ddd/aggregates-dependencies-rules';
        const AGGREGATE_MANDATORY_DRAGEE_TEST_DIRECTORY = './ddd/aggregates-mandatories-rules';
        const AGGREGATE_SIZE_LIMITS_DRAGEE_TEST_DIRECTORY = './ddd/aggregates-size-limits-rules';

        describe('An aggregate must contain only value objects, entities, or events', () => {
            rulePassed(`${AGGREGATE_DEPENDENCY_DRAGEE_TEST_DIRECTORY}/rule-passed.json`);
            ruleFailed(`${AGGREGATE_DEPENDENCY_DRAGEE_TEST_DIRECTORY}/rule-failed.json`);
        });
        describe('An aggregate must at least contains one entity', () => {
            rulePassed(`${AGGREGATE_MANDATORY_DRAGEE_TEST_DIRECTORY}/rule-passed.json`);
            ruleFailed(`${AGGREGATE_MANDATORY_DRAGEE_TEST_DIRECTORY}/rule-failed.json`);
        });

        describe(`An aggregate must not have more than 3 dependencies to entities`, () => {
            rulePassed(`${AGGREGATE_SIZE_LIMITS_DRAGEE_TEST_DIRECTORY}/rule-passed.json`);
            ruleFailed(`${AGGREGATE_SIZE_LIMITS_DRAGEE_TEST_DIRECTORY}/rule-failed.json`);
        });
    });
    describe('Repository Rules', () => {
        const REPOSITORY_DRAGEE_TEST_DIRECTORY = './ddd/repositories-rules';

        describe('A repository must be called only inside a Service', () => {
            rulePassed(`${REPOSITORY_DRAGEE_TEST_DIRECTORY}/rule-passed.json`);
            ruleFailed(`${REPOSITORY_DRAGEE_TEST_DIRECTORY}/rule-failed.json`);
        });
    });

    describe('Value object rules', () => {
        const VALUE_OBJECT_DRAGEE_DIRECTORY = './ddd/value-object-rules';

        describe('Should only contains entities', () => {
            rulePassed(`${VALUE_OBJECT_DRAGEE_DIRECTORY}/rule-passed.json`);
            ruleFailed(`${VALUE_OBJECT_DRAGEE_DIRECTORY}/rule-failed.json`);
        });
    });

    describe('Service rules', () => {
        const SERVICE_DRAGEE_DIRECTORY = './ddd/services-rules';
        describe('Should only contains repositories, entities or value object', () => {
            rulePassed(`${SERVICE_DRAGEE_DIRECTORY}/rule-passed.json`);
            ruleFailed(`${SERVICE_DRAGEE_DIRECTORY}/rule-failed.json`);
        });
    });

    describe('Factory rules', () => {
        const FACTORY_DRAGEE_DIRECTORY = './ddd/factories-rules';
        describe('Should only contains entities, value objects or aggregates', () => {
            rulePassed(`${FACTORY_DRAGEE_DIRECTORY}/rule-passed.json`);
            ruleFailed(`${FACTORY_DRAGEE_DIRECTORY}/rule-failed.json`);
        });
    });

    describe('Command rules', () => {
        const COMMAND_DRAGEE_DIRECTORY = './ddd/command-dependencies-rules';
        describe('Should only contains Aggregate', () => {
            rulePassed(`${COMMAND_DRAGEE_DIRECTORY}/rule-passed.json`);
            ruleFailed(`${COMMAND_DRAGEE_DIRECTORY}/rule-failed.json`);
        });
    });
});
