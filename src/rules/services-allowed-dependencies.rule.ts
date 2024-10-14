/**
 * **services-allowed-dependencies :**
 * Services can only have dependencies of types "ddd/value_object", "ddd/entity", "ddd/repository" and "ddd/command"
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
 *     "name": "AService",
 *     "profile": "ddd/service",
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
 *     "name": "AnEntity",
 *     "profile": "ddd/entity"
 * },
 * {
 *     "name": "AService",
 *     "profile": "ddd/service",
 *     "depends_on": {
 *         "AnEntity": [
 *             "field"
 *         ]
 *     }
 * }
 * ```
 *
 * @module Services Allowed Dependencies
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
    commandProfile,
    entityProfile,
    profileOf,
    profiles,
    repositoryProfile,
    serviceProfile,
    valueObjectProfile
} from '../ddd.model.ts';

const assertDrageeDependency = ({ root, dependencies }: DrageeDependency): RuleResult[] =>
    dependencies.map(dependency =>
        expectDragee(
            root,
            dependency,
            `This service must not have any dependency of type "${dependency.profile}"`,
            dragee =>
                profileOf(
                    dragee,
                    repositoryProfile,
                    entityProfile,
                    valueObjectProfile,
                    commandProfile
                )
        )
    );

export default {
    label: 'Services Allowed Dependencies',
    severity: RuleSeverity.ERROR,
    handler: (dragees: Dragee[]): RuleResult[] =>
        profiles[serviceProfile]
            .findIn(dragees)
            .map(service => directDependencies(service, dragees))
            .filter(dep => dep.dependencies)
            .flatMap(dep => assertDrageeDependency(dep))
};
