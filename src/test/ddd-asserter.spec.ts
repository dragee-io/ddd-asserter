import { describe, expect, test } from 'bun:test';
import { type Report, asserterHandler, generateReportForRule } from '@dragee-io/type/asserter';
import type { Dragee } from '@dragee-io/type/common';

import dddAsserter from '../..';

interface TestObject {
    dragees: Dragee[];
    result: {
        pass: boolean;
        errors: string[];
    };
}

function rulePassed(drageeDirectory: string, file: string) {
    test('Rule passed', () => {
        const data: TestObject = require(drageeDirectory);
        const report = generateReportForRule(dddAsserter, data.dragees, file);
        expect(report.pass).toBe(data.result.pass);
    });
}

function ruleFailed(drageeDirectory: string, file: string) {
    test('Rule failed', () => {
        const data: TestObject = require(drageeDirectory);
        const report = generateReportForRule(dddAsserter, data.dragees, file);

        expect(report.pass).toBe(data.result.pass);
        for (const error of data.result.errors) {
            expect(JSON.stringify(report.errors)).toContain(JSON.stringify(error));
        }
    });
}

describe('DDD Asserter', () => {
    const FOLDER = './ddd/';

    test('assert with no dragees', () => {
        const report: Report = asserterHandler(dddAsserter, []);
        expect(report.pass).toBeTrue();
        expect(report.namespace).toBe('ddd');
    });

    describe('Aggregate Rules', () => {
        const AGGREGATE_FOLDER = `${FOLDER}aggregates-rules/`;
        const AGGREGATE_ALLOWED_DEPENDENCIES_RULE = 'aggregates-allowed-dependencies';
        const AGGREGATE_MANDATORY_DEPENDENCIES_RULE = 'aggregates-mandatory-dependencies';
        const AGGREGATE_SIZE_LIMITS_RULE = 'aggregates-size-limits';

        describe('An aggregate must contain only value objects, entities, or events', () => {
            rulePassed(
                `${AGGREGATE_FOLDER}${AGGREGATE_ALLOWED_DEPENDENCIES_RULE}-rule/rule-passed.json`,
                AGGREGATE_ALLOWED_DEPENDENCIES_RULE
            );
            ruleFailed(
                `${AGGREGATE_FOLDER}${AGGREGATE_ALLOWED_DEPENDENCIES_RULE}-rule/rule-failed.json`,
                AGGREGATE_ALLOWED_DEPENDENCIES_RULE
            );
        });

        describe('An aggregate must at least contains one entity', () => {
            rulePassed(
                `${AGGREGATE_FOLDER}${AGGREGATE_MANDATORY_DEPENDENCIES_RULE}-rule/rule-passed.json`,
                AGGREGATE_MANDATORY_DEPENDENCIES_RULE
            );
            ruleFailed(
                `${AGGREGATE_FOLDER}${AGGREGATE_MANDATORY_DEPENDENCIES_RULE}-rule/rule-failed.json`,
                AGGREGATE_MANDATORY_DEPENDENCIES_RULE
            );
        });

        describe(`An aggregate must not have more than 3 dependencies to entities`, () => {
            rulePassed(
                `${AGGREGATE_FOLDER}${AGGREGATE_SIZE_LIMITS_RULE}-rule/rule-passed.json`,
                AGGREGATE_SIZE_LIMITS_RULE
            );
            ruleFailed(
                `${AGGREGATE_FOLDER}${AGGREGATE_SIZE_LIMITS_RULE}-rule/rule-failed.json`,
                AGGREGATE_SIZE_LIMITS_RULE
            );
        });
    });

    describe('Repository Rules', () => {
        const REPOSITORY_FOLDER = `${FOLDER}repositories-rules/`
        const REPOSITORY_DEPENDENCIES_RULE = 'repositories-dependencies';

        describe('A repository must be called only inside a Service', () => {
            rulePassed(`${REPOSITORY_FOLDER}${REPOSITORY_DEPENDENCIES_RULE}-rule/rule-passed.json`, REPOSITORY_DEPENDENCIES_RULE);
            ruleFailed(`${REPOSITORY_FOLDER}${REPOSITORY_DEPENDENCIES_RULE}-rule/rule-failed.json`, REPOSITORY_DEPENDENCIES_RULE);
        });
    });

    describe('Value object rules', () => {
        const VALUE_OBJECTS_FOLDER = `${FOLDER}value-objects-rules/`
        const VALUE_OBJECT_ALLOWED_DEPENDENCIES_RULE = 'value-object-allowed-dependencies';

        describe('Should only contains entities', () => {
            rulePassed(
                `${VALUE_OBJECTS_FOLDER}${VALUE_OBJECT_ALLOWED_DEPENDENCIES_RULE}-rule/rule-passed.json`,
                VALUE_OBJECT_ALLOWED_DEPENDENCIES_RULE
            );
            ruleFailed(
                `${VALUE_OBJECTS_FOLDER}${VALUE_OBJECT_ALLOWED_DEPENDENCIES_RULE}-rule/rule-failed.json`,
                VALUE_OBJECT_ALLOWED_DEPENDENCIES_RULE
            );
        });
    });

    describe('Service rules', () => {
        const SERVICE_FOLDER = `${FOLDER}services-rules/`
        const SERVICE_ALLOWED_DEPENDENCIES_RULE = 'services-allowed-dependencies';

        describe('Should only contains repositories, entities or value object', () => {
            rulePassed(
                `${SERVICE_FOLDER}${SERVICE_ALLOWED_DEPENDENCIES_RULE}-rule/rule-passed.json`,
                SERVICE_ALLOWED_DEPENDENCIES_RULE
            );
            ruleFailed(
                `${SERVICE_FOLDER}${SERVICE_ALLOWED_DEPENDENCIES_RULE}-rule/rule-failed.json`,
                SERVICE_ALLOWED_DEPENDENCIES_RULE
            );
        });
    });

    describe('Factory rules', () => {
        const FACTORIES_FOLDER = `${FOLDER}factories-rules/`;
        const FACTORIES_ALLOWED_DEPENDENCIES_RULE = 'factories-allowed-dependencies';
        
        describe('Should only contains entities, value objects or aggregates', () => {
            rulePassed(`${FACTORIES_FOLDER}${FACTORIES_ALLOWED_DEPENDENCIES_RULE}-rule/rule-passed.json`, FACTORIES_ALLOWED_DEPENDENCIES_RULE);
            ruleFailed(`${FACTORIES_FOLDER}${FACTORIES_ALLOWED_DEPENDENCIES_RULE}-rule/rule-failed.json`, FACTORIES_ALLOWED_DEPENDENCIES_RULE);
        });
    });

    describe('Command rules', () => {
        const COMMAND_FOLDER = `${FOLDER}commands-rules/`;
        const COMMANDS_ALLOWED_DEPENDENCIES_RULE = 'commands-allowed-dependencies';

        describe('Should only contains Aggregate', () => {
            rulePassed(
                `${COMMAND_FOLDER}${COMMANDS_ALLOWED_DEPENDENCIES_RULE}-rule/rule-passed.json`,
                COMMANDS_ALLOWED_DEPENDENCIES_RULE
            );
            ruleFailed(
                `${COMMAND_FOLDER}${COMMANDS_ALLOWED_DEPENDENCIES_RULE}-rule/rule-failed.json`,
                COMMANDS_ALLOWED_DEPENDENCIES_RULE
            );
        });
    });
});
