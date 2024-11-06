/**
 * **aggregates-size-limits :**
 * Aggregates mustn't contain more tha 3 dependencies to entities
 *
 * ## Examples
 *
 * Example of incorrect dragees for this rule:
 *
 * ```json
 *  {
        "name": "AValueObject1",
        "profile": "ddd/entity"
    },
    {
        "name": "AValueObject2",
        "profile": "ddd/entity"
    },
    {
        "name": "AValueObject3",
        "profile": "ddd/entity"
    },
    {
        "name": "AValueObject4",
        "profile": "ddd/entity"
    },
    {
        "name": "AnAggregate",
        "profile": "ddd/aggregate",
        "depends_on": {
            "AValueObject1": ["field"],
            "AValueObject2": ["field"],
            "AValueObject3": ["field"],
            "AValueObject4": ["field"]
        }
    }
 * ```
 *
 * Example of correct dragees for this rule:
 *
 * ```json
 *  {
        "name": "AValueObject1",
        "profile": "ddd/entity"
    },
    {
        "name": "AValueObject2",
        "profile": "ddd/entity"
    },
    {
        "name": "AValueObject3",
        "profile": "ddd/entity"
    },
    {
        "name": "AnAggregate",
        "profile": "ddd/aggregate",
        "depends_on": {
            "AValueObject1": ["field"],
            "AValueObject2": ["field"],
            "AValueObject3": ["field"]
        }
    }
 * ```
 *
 * @module Aggregates Size Limits
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

const NUMBER_OF_ENTITIES_LIMIT = 3;

const ensureDrageeSizeLimits = ({ root, dependencies }: DrageeDependency): RuleResult =>
    expectDragees(
        root,
        dependencies,
        `This aggregate mustn't contain more than 3 "ddd/entity" type of dragees`,
        dependencies => !isLimitSizeExceeded(dependencies)
    );

function isLimitSizeExceeded(dependencies: Dragee[]): boolean {
    return (
        dependencies.reduce((acc, dep) => (dep.profile === entityProfile ? acc + 1 : acc), 0) >
        NUMBER_OF_ENTITIES_LIMIT
    );
}

export default {
    label: 'Aggregates Size Limits',
    severity: RuleSeverity.ERROR,
    handler: (dragees: Dragee[]): RuleResult[] =>
        profiles[aggregateProfile]
            .findIn(dragees)
            .map(aggregate => directDependencies(aggregate, dragees))
            .map(ensureDrageeSizeLimits)
};
