import { describe } from 'bun:test';
import { rulePassed, ruleFailed } from '../../test_utils';

describe('Service rules', () => {
    const SERVICE_FOLDER = `./ddd/services-rules/`;
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
