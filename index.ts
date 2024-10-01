import { findRules } from "@dragee-io/type/asserter";

export default {
    namespace: 'ddd',
    rules: findRules('ddd', `${import.meta.dir}/src/rules/`)
};