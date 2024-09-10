
import { type Dragee, type RuleResult, expectDragee, directDependencies, type DrageeDependency, RuleSeverity } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { profiles, profileOf, factoryProfile, aggregateProfile, entityProfile, valueObjectProfile } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency) => 
    dependencies.map(dependency => 
        expectDragee(root, dependency, `This factory must not have any dependency of type "${dependency.profile}"`, 
            (dragee) => profileOf(dragee, aggregateProfile, entityProfile, valueObjectProfile)
        )
    )

export default new DddRule(
    "Command Allowed Dependency Rule",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => 
        profiles[factoryProfile].findIn(dragees)
            .map(factory => directDependencies(factory, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));