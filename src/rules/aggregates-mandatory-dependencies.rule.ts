
import { type Dragee, type RuleResult, expectDragees, directDependencies, type DrageeDependency } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { kinds, entityKind, aggregateKind } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult =>
    expectDragees(dependencies, `The aggregate "${root.name}" must at least contain a "ddd/entity" type dragee`, 
        (dependencies) => !!kinds[entityKind].findIn(dependencies).length
    )

export default new DddRule(
    "Aggregates Mandatory Dependencies",
    (dragees: Dragee[]): RuleResult[] => 
        kinds[aggregateKind].findIn(dragees)
            .map(aggregate => directDependencies(aggregate, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));
