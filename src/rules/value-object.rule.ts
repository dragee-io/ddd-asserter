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
    "Value Object Rule",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => 
        profiles[valueObjectProfile].findIn(dragees)
            .map(valueObject => directDependencies(valueObject, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));