import { type Dragee, type RuleResult, expectDragee, directDependencies, type DrageeDependency, RuleSeverity } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { profiles, profileOf, aggregateProfile, valueObjectProfile, entityProfile, eventProfile,  } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => 
    dependencies.map(dependency => 
        expectDragee(dependency, `The aggregate "${root.name}" must not have any dependency of type "${dependency.profile}"`, 
            (dragee) => profileOf(dragee, valueObjectProfile, entityProfile, eventProfile)
        )
    );

export default new DddRule(
    "Aggregates Allowed Dependencies",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] =>
        profiles[aggregateProfile].findIn(dragees)
            .map(aggregate => directDependencies(aggregate, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));