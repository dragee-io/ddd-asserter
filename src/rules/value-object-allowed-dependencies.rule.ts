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
import { type Dragee, type RuleResult, expectDragee, directDependencies, type DrageeDependency, RuleSeverity } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { profiles, valueObjectProfile, profileOf } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] =>
    dependencies.map(dependency =>
        expectDragee(root, dependency, `This value object must not have any dependency of type "${dependency.profile}"`, 
            (dragee) => profileOf(dragee, valueObjectProfile)
        )
    )

export default new DddRule(
    "Value Objects Allowed Dependencies",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => 
        profiles[valueObjectProfile].findIn(dragees)
            .map(valueObject => directDependencies(valueObject, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));