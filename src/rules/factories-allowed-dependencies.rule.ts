/**
 * **factories-allowed-dependencies :**
 * Factories can only have dependencies of types "ddd/value_object", "ddd/entity" and "ddd/aggregate"
 *
 * ## Examples
 *
 * Example of incorrect dragees for this rule:
 *
 * ```json
 * {
 *     "name": "ARepository",
 *     "profile": "ddd/repository"
 * },
 * {
 *     "name": "AFactory",
 *     "profile": "ddd/factory",
 *     "depends_on": {
 *         "ARepository": [
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
 *     "name": "AFactory",
 *     "profile": "ddd/factory",
 *     "depends_on": {
 *         "AnAggregate": [
 *             "field"
 *         ]
 *     }
 * }
 * ```
 *
 * @module Factories Allowed Dependencies
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
    factoryProfile,
    profileOf,
    profiles,
    valueObjectProfile
} from '../ddd.model.ts';

const assertDrageeDependency = ({ root, dependencies }: DrageeDependency) =>
    dependencies.map(dependency =>
        expectDragee(
            root,
            dependency,
            `This factory must not have any dependency of type "${dependency.profile}"`,
            dragee => profileOf(dragee, aggregateProfile, entityProfile, valueObjectProfile)
        )
    );

export default {
    label: 'Factories Allowed Dependencies',
    severity: RuleSeverity.ERROR,
    handler: (dragees: Dragee[]): RuleResult[] =>
        profiles[factoryProfile]
            .findIn(dragees)
            .map(factory => directDependencies(factory, dragees))
            .filter(dep => dep.dependencies)
            .flatMap(dep => assertDrageeDependency(dep))
};
