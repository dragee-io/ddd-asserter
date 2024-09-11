import { type Dragee, type RuleResult, RuleSeverity, expectDragee } from "@dragee-io/asserter-type";
import { DddRule } from "../ddd-rule.model.ts";
import { profileOf, repositoryProfile, serviceProfile } from "../ddd.model.ts";

export default new DddRule(
    "Repositories Dependencies",
    RuleSeverity.ERROR,
    (dragees: Dragee[]): RuleResult[] => {
        const repositories = dragees
            .filter(dragee => profileOf(dragee, repositoryProfile))
    
        const drageesWithRepositoryDependencies = dragees
            .map(dragee => {
                if (!dragee.depends_on) return []
                return Object.keys(dragee.depends_on).filter(name => includeRepoName(repositories, name)).map(repositoryName => {
                    return {dragee, repositoryName}
                })
            })
            .flatMap(drageeWithRepo => drageeWithRepo)
            .filter(drageeWithRepo => drageeWithRepo.repositoryName)
    
        return drageesWithRepositoryDependencies
            .map(drageeWithRepositories =>
                expectDragee(findRepoDragee(repositories, drageeWithRepositories.repositoryName), drageeWithRepositories.dragee, 
                    `This repository must not be a dependency of "${drageeWithRepositories.dragee.profile}"`, 
                    (drageeWithRepositories) => profileOf(drageeWithRepositories, serviceProfile)
                )
            )
    });

const includeRepoName = (repositoryNames: Dragee[], name: string): boolean => repositoryNames.map(rn => rn.name).includes(name);
const findRepoDragee = (repositories: Dragee[], repositoryName: string): Dragee => repositories.find(r => r.name === repositoryName)!;