import { describe } from 'bun:test';
import { rulePassed, ruleFailed } from '../../test_utils';

describe('Command rules', () => {
    const COMMAND_FOLDER = `./ddd/commands-rules/`;
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
