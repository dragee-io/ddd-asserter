import { describe } from 'bun:test';
import { rulePassed, ruleFailed } from '../../test_utils';

describe('Value object rules', () => {
    const VALUE_OBJECTS_FOLDER = `./ddd/value-objects-rules/`;
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
