
import { type Dragee, type RuleResult, expectDragee, directDependencies, type DrageeDependency, RuleSeverity } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { profiles, profileOf, commandProfile, aggregateProfile } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] =>
    dependencies.map(dependency => 
        expectDragee(dependency, `The command "${root.name}" must not have any dependency of type "${dependency.profile}"`,
            (dragee) => profileOf(dragee, aggregateProfile)
        )
    )

export default new DddRule(
    "Command Allowed Dependency Rule",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => 
        profiles[commandProfile].findIn(dragees)
            .map(command => directDependencies(command, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));