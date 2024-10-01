/**
 * **value-object-allowed-dependencies :**
 * Value Objects can only have dependencies of type "ddd/value_object"
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
 *     "name": "AValueObject1",
 *     "profile": "ddd/value_object",
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
 *     "name": "AValueObject2",
 *     "profile": "ddd/value_object"
 * },
 * {
 *     "name": "AValueObject1",
 *     "profile": "ddd/value_object",
 *     "depends_on": {
 *         "AValueObject2": [
 *             "field"
 *         ]
 *     }
 * }
 * ```
 * 
 * @module Value Objects Allowed Dependencies
 * 
 */
import { type RuleResult, expectDragee, directDependencies, RuleSeverity } from "@dragee-io/type/asserter";
import type { Dragee, DrageeDependency } from "@dragee-io/type/common";
import { profiles, valueObjectProfile, profileOf } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] =>
    dependencies.map(dependency =>
        expectDragee(root, dependency, `This value object must not have any dependency of type "${dependency.profile}"`, 
            (dragee) => profileOf(dragee, valueObjectProfile)
        )
    )

export default {
    label: "Value Objects Allowed Dependencies",
    severity: RuleSeverity.ERROR,
    handler: (dragees: Dragee[]): RuleResult[] => 
        profiles[valueObjectProfile].findIn(dragees)
            .map(valueObject => directDependencies(valueObject, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result)};