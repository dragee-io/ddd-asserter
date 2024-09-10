
import { type Dragee, type RuleResult, expectDragees, directDependencies, type DrageeDependency, RuleSeverity } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { profiles, entityProfile, aggregateProfile } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult =>
    expectDragees(root, dependencies, `The aggregate "${root.name}" must at least contain a "ddd/entity" type dragee`, 
        (dependencies) => !!profiles[entityProfile].findIn(dependencies).length
    )

export default new DddRule(
    "Aggregates Mandatory Dependencies",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => 
        profiles[aggregateProfile].findIn(dragees)
            .map(aggregate => directDependencies(aggregate, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));
