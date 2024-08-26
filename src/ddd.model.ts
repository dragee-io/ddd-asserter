import type { Dragee } from "@dragee-io/asserter-type";

export const entityKind = "ddd/entity";
export const aggregateKind = "ddd/aggregate";
export const commandKind = "ddd/command";
export const factoryKind  = "ddd/factory";
export const serviceKind = "ddd/service";
export const valueObjectKind = "ddd/value_object";
export const eventKind = "ddd/event";
export const repositoryKind = "ddd/repository";

const kindsName =
  [
    aggregateKind, 
    entityKind,
    eventKind,
    repositoryKind,
    serviceKind,
    valueObjectKind,
    factoryKind,
    commandKind
  ]; 

export type Kind = typeof kindsName[number]

type DDDKindChecks = {
  [kind in Kind]: {
   findIn: (dragees : Dragee[]) => Dragee[],
   is:(kind : string) => boolean
  }
}

export const kinds: DDDKindChecks = {} as DDDKindChecks;

kindsName.map(kind => {
  kinds[kind] = {
    is: (value: string) => value === kind,
    findIn: (dragees: Dragee[]) => dragees.filter(dragee => dragee.kind_of === kind)
  }
  return kinds[kind];
})

export const kindOf = (dragee: Dragee, ...kindsFilter: Kind[]): boolean => 
  kindsFilter.map(kf => kinds[kf].is(dragee.kind_of)).some(b => b)