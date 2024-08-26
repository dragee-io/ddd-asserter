
import { type Dragee, type RuleResult, expectDragee, directDependencies, type DrageeDependency } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { kinds, kindOf, factoryKind, aggregateKind, entityKind, valueObjectKind } from "../ddd.model.ts";

const assertDrageeDependency = ({root, dependencies}: DrageeDependency) => 
    dependencies.map(dependency => 
        expectDragee(dependency, `The factory "${root.name}" must not have any dependency of type "${dependency.kind_of}"`, 
            (dragee) => kindOf(dragee, aggregateKind, entityKind, valueObjectKind)
        )
    )

export default new DddRule(
    "Command Allowed Dependency Rule",
    (dragees: Dragee[]): RuleResult[] => 
        kinds[factoryKind].findIn(dragees)
            .map(factory => directDependencies(factory, dragees))
            .filter(dep => dep.dependencies)
            .map(dep => assertDrageeDependency(dep))
            .flatMap(result => result));