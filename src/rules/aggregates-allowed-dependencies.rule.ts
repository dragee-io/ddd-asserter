import { type Dragee, type RuleResult, expectDragee, directDependencies, type DrageeDependency } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { kinds, kindOf, aggregateKind, valueObjectKind, entityKind, eventKind,  } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency): RuleResult[] => 
    dependencies.map(dependency => 
        expectDragee(dependency, `The aggregate "${root.name}" must not have any dependency of type "${dependency.kind_of}"`, 
            (dragee) => kindOf(dragee, valueObjectKind, entityKind, eventKind)
        )
    );

export default new DddRule(
    "Aggregates Allowed Dependencies", 
    (dragees: Dragee[]): RuleResult[] =>
        kinds[aggregateKind].findIn(dragees)
            .map(aggregate => directDependencies(aggregate, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));