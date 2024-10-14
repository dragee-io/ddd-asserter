/**
 * **commands-allowed-dependencies :**
 * Commands can only have dependencies of type "ddd/aggregate"
 *
 * ## Examples
 *
 * Example of incorrect dragees for this rule:
 *
 * ```json
 * {
 *     "name": "AnEvent",
 *     "profile": "ddd/event"
 * },
 * {
 *     "name": "ACommand",
 *     "profile": "ddd/command",
 *     "depends_on": {
 *         "AnEvent": [
 *             "field"
 *         ]
 *     }
 * }
 * ```
 * Example of correct dragees for this rule:
 *
 * ```json
 * {
 *     "name": "AnAggregate",
 *     "profile": "ddd/aggregate"
 * },
 * {
 *     "name": "ACommand",
 *     "profile": "ddd/command",
 *     "depends_on": {
 *         "AnAggregate": [
 *             "field"
 *         ]
 *     }
 * }
 * ```
 *
 * @module Commands Allowed Dependencies
 *
 */
import {
    type RuleResult,
    RuleSeverity,
    directDependencies,
    expectDragee
} from '@dragee-io/type/asserter';
import type { Dragee, DrageeDependency } from '@dragee-io/type/common';
import { aggregateProfile, commandProfile, profileOf, profiles } from '../ddd.model.ts';

const assertDrageeDependency = ({ root, dependencies }: DrageeDependency): RuleResult[] =>
    dependencies.map(dependency =>
        expectDragee(
            root,
            dependency,
            `This command must not have any dependency of type "${dependency.profile}"`,
            dragee => profileOf(dragee, aggregateProfile)
        )
    );

export default {
    label: 'Commands Allowed Dependencies',
    severity: RuleSeverity.ERROR,
    handler: (dragees: Dragee[]): RuleResult[] =>
        profiles[commandProfile]
            .findIn(dragees)
            .map(command => directDependencies(command, dragees))
            .filter(dep => dep.dependencies)
            .flatMap(dep => assertDrageeDependency(dep))
};
