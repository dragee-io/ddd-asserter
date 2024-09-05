import { type Dragee, type RuleResult, expectDragee, directDependencies, type DrageeDependency, RuleSeverity } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { commandKind, entityKind, kindOf, kinds, repositoryKind, serviceKind, valueObjectKind } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] =>
    dependencies.map(dependency =>
        expectDragee(dependency, `The service "${root.name}" must not have any dependency of type "${dependency.kind_of}"`, 
            (dragee) => kindOf(dragee, repositoryKind, entityKind, valueObjectKind, commandKind)
        )
)

export default new DddRule(
    "Service Allowed Dependency Rule",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => 
        kinds[serviceKind].findIn(dragees)
            .map(service => directDependencies(service, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));