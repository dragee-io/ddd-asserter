import { type Dragee, type RuleResult, expectDragee, directDependencies, type DrageeDependency, RuleSeverity } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { kinds, valueObjectKind, kindOf } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] =>
    dependencies.map(dependency =>
        expectDragee(dependency, `The value object "${root.name}" must not have any dependency of type "${dependency.kind_of}"`, 
            (dragee) => kindOf(dragee, valueObjectKind)
        )
    )

export default new DddRule(
    "Value Object Rule",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => 
        kinds[valueObjectKind].findIn(dragees)
            .map(valueObject => directDependencies(valueObject, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));