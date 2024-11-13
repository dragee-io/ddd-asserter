import { describe } from 'bun:test';
import { rulePassed, ruleFailed } from '../../test_utils';

describe('Factory rules', () => {
    const FACTORIES_FOLDER = `./ddd/factories-rules/`;
    const FACTORIES_ALLOWED_DEPENDENCIES_RULE = 'factories-allowed-dependencies';

    describe('Should only contains entities, value objects or aggregates', () => {
        rulePassed(
            `${FACTORIES_FOLDER}${FACTORIES_ALLOWED_DEPENDENCIES_RULE}-rule/rule-passed.json`,
            FACTORIES_ALLOWED_DEPENDENCIES_RULE
        );
        ruleFailed(
            `${FACTORIES_FOLDER}${FACTORIES_ALLOWED_DEPENDENCIES_RULE}-rule/rule-failed.json`,
            FACTORIES_ALLOWED_DEPENDENCIES_RULE
        );
    });
});
