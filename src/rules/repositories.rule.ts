import { type Dragee, type RuleResult, RuleSeverity, expectDragee } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { profileOf, repositoryProfile, serviceProfile } from "../ddd.model.ts";

export default new DddRule(
    "Repository Rule",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => {
        const repositoryNames = dragees
            .filter(dragee => profileOf(dragee, repositoryProfile))
            .map(repository => repository.name)
    
        const drageesWithRepositoryDependencies = dragees
            .map(dragee => {
                if (!dragee.depends_on) return []
                return Object.keys(dragee.depends_on).filter(name => repositoryNames.includes(name)).map(repositoryName => {
                    return {dragee, repositoryName}
                })
            })
            .flatMap(drageeWithRepo => drageeWithRepo)
            .filter(drageeWithRepo => drageeWithRepo.repositoryName)
    
        return drageesWithRepositoryDependencies
            .map(drageeWithRepositories =>
                expectDragee(drageeWithRepositories.dragee, 
                    `The repository "${drageeWithRepositories.repositoryName}" must not be a dependency of "${drageeWithRepositories.dragee.profile}"`, 
                    (drageeWithRepositories) => profileOf(drageeWithRepositories, serviceProfile)
                )
            )
    });