/**
 * **aggregates-mandatory-dependencies :**
 * Aggregates must at least contain a "ddd/entity" type dragee
 * 
 * ## Examples
 * 
 * Example of incorrect dragees for this rule: 
 * 
 * ```json
 * {
 *     "name": "AnAggregate",
 *     "profile": "ddd/aggregate",
 * }
 * ```
 * Example of correct dragees for this rule: 
 * 
 * ```json
 * {
 *     "name": "AnAggregate",
 *     "profile": "ddd/aggregate",
 *     "depends_on": {
 *         "AnEntity": [
 *             "field"
 *         ]
 *     }
 * },
 * {
 *     "name": "AnEntity",
 *     "profile": "ddd/entity"
 * }
 * ```
 * 
 * @module Aggregates Mandatory Dependencies
 * 
 */
import { type Dragee, type RuleResult, expectDragees, directDependencies, type DrageeDependency, RuleSeverity } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { profiles, entityProfile, aggregateProfile } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult =>
    expectDragees(root, dependencies, `This aggregate must at least contain a "ddd/entity" type dragee`, 
        (dependencies) => !!profiles[entityProfile].findIn(dependencies).length
    )

export default new DddRule(
    "Aggregates Mandatory Dependencies",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => 
        profiles[aggregateProfile].findIn(dragees)
            .map(aggregate => directDependencies(aggregate, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));
