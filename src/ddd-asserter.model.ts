import { Asserter, findRules } from "@dragee-io/asserter-type";

export class DddAsserter extends Asserter {
    constructor() {
        super("ddd", findRules(import.meta.dir + '/rules/'));
    }
}