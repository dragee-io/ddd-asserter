import { describe } from 'bun:test';
import { rulePassed, ruleFailed } from '../../test_utils';

describe('Repository Rules', () => {
    const REPOSITORY_FOLDER = `./ddd/repositories-rules/`;
    const REPOSITORY_DEPENDENCIES_RULE = 'repositories-dependencies';

    describe('A repository must be called only inside a Service', () => {
        rulePassed(
            `${REPOSITORY_FOLDER}${REPOSITORY_DEPENDENCIES_RULE}-rule/rule-passed.json`,
            REPOSITORY_DEPENDENCIES_RULE
        );
        ruleFailed(
            `${REPOSITORY_FOLDER}${REPOSITORY_DEPENDENCIES_RULE}-rule/rule-failed.json`,
            REPOSITORY_DEPENDENCIES_RULE
        );
    });
});
