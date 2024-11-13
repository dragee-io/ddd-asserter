import { createRuleFailedOnAsserter, createRulePassedOnAsserter } from '@dragee-io/type/test-utils';
import dddAsserter from '../..';

export const rulePassed = createRulePassedOnAsserter(dddAsserter, require);

export const ruleFailed = createRuleFailedOnAsserter(dddAsserter, require);
