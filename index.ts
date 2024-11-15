import { findRule, findRules, type Asserter } from '@dragee-io/type/asserter';

export default {
    namespace: 'ddd',
    rules: findRules('ddd', `${import.meta.dir}/src/rules/`),
    rule: (file: string) => findRule('ddd', `${import.meta.dir}/src/rules/`, file)
} satisfies Asserter;
