import { type Dragee, type RuleResult, expectDragee, directDependencies, type DrageeDependency, RuleSeverity } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { commandProfile, entityProfile, profileOf, profiles, repositoryProfile, serviceProfile, valueObjectProfile } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] =>
    dependencies.map(dependency =>
        expectDragee(dependency, `The service "${root.name}" must not have any dependency of type "${dependency.profile}"`, 
            (dragee) => profileOf(dragee, repositoryProfile, entityProfile, valueObjectProfile, commandProfile)
        )
)

export default new DddRule(
    "Service Allowed Dependency Rule",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => 
        profiles[serviceProfile].findIn(dragees)
            .map(service => directDependencies(service, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));