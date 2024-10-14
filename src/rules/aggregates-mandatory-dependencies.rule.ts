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
import {
    type RuleResult,
    RuleSeverity,
    directDependencies,
    expectDragees
} from '@dragee-io/type/asserter';
import type { Dragee, DrageeDependency } from '@dragee-io/type/common';
import { aggregateProfile, entityProfile, profiles } from '../ddd.model.ts';

const assertDrageeDependency = ({ root, dependencies }: DrageeDependency): RuleResult =>
    expectDragees(
        root,
        dependencies,
        `This aggregate must at least contain a "ddd/entity" type dragee`,
        dependencies => !!profiles[entityProfile].findIn(dependencies).length
    );

export default {
    label: 'Aggregates Mandatory Dependencies',
    severity: RuleSeverity.ERROR,
    handler: (dragees: Dragee[]): RuleResult[] =>
        profiles[aggregateProfile]
            .findIn(dragees)
            .map(aggregate => directDependencies(aggregate, dragees))
            .filter(dep => dep.dependencies)
            .flatMap(dep => assertDrageeDependency(dep))
};
