/**
 * **aggregates-allowed-dependencies :**
 * Aggregates can only have dependencies of types "ddd/value_object", "ddd/entity" and "ddd/event"
 *
 * ## Examples
 *
 * Example of incorrect dragees for this rule:
 *
 * ```json
 * {
 *     "name": "AService",
 *     "profile": "ddd/service"
 * },
 * {
 *     "name": "AnAggregate",
 *     "profile": "ddd/aggregate",
 *     "depends_on": {
 *         "AService": [
 *             "field"
 *         ]
 *     }
 * }
 * ```
 * Example of correct dragees for this rule:
 *
 * ```json
 * {
 *     "name": "AnEntity",
 *     "profile": "ddd/entity"
 * },
 * {
 *     "name": "AnAggregate",
 *     "profile": "ddd/aggregate",
 *     "depends_on": {
 *         "AnEntity": [
 *             "field"
 *         ]
 *     }
 * }
 * ```
 *
 * @module Aggregates Allowed Dependencies
 *
 */
import {
    type RuleResult,
    RuleSeverity,
    directDependencies,
    expectDragee
} from '@dragee-io/type/asserter';
import type { Dragee, DrageeDependency } from '@dragee-io/type/common';
import {
    aggregateProfile,
    entityProfile,
    eventProfile,
    profileOf,
    profiles,
    valueObjectProfile
} from '../ddd.model.ts';

const assertDrageeDependency = ({ root, dependencies }: DrageeDependency): RuleResult[] =>
    dependencies.map(dependency =>
        expectDragee(
            root,
            dependency,
            `This aggregate must not have any dependency of type "${dependency.profile}"`,
            dragee => profileOf(dragee, valueObjectProfile, entityProfile, eventProfile)
        )
    );

export default {
    label: 'Aggregates Allowed Dependencies',
    severity: RuleSeverity.ERROR,
    handler: (dragees: Dragee[]): RuleResult[] =>
        profiles[aggregateProfile]
            .findIn(dragees)
            .map(aggregate => directDependencies(aggregate, dragees))
            .filter(dep => dep.dependencies)
            .flatMap(dep => assertDrageeDependency(dep))
};
