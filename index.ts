import { findRules } from "@dragee-io/asserter-type";

export default {
    namespace: 'ddd',
    rules: findRules('ddd', `${import.meta.dir}/src/rules/`)
};