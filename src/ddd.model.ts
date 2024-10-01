import type { Dragee } from "@dragee-io/type/common";

export const entityProfile = "ddd/entity";
export const aggregateProfile = "ddd/aggregate";
export const commandProfile = "ddd/command";
export const factoryProfile  = "ddd/factory";
export const serviceProfile = "ddd/service";
export const valueObjectProfile = "ddd/value_object";
export const eventProfile = "ddd/event";
export const repositoryProfile = "ddd/repository";

const profilesName =
  [
    aggregateProfile, 
    entityProfile,
    eventProfile,
    repositoryProfile,
    serviceProfile,
    valueObjectProfile,
    factoryProfile,
    commandProfile
  ]; 

export type Profile = typeof profilesName[number]

type DDDProfileChecks = {
  [profile in Profile]: {
   findIn: (dragees : Dragee[]) => Dragee[],
   is:(profile : string) => boolean
  }
}

export const profiles: DDDProfileChecks = {} as DDDProfileChecks;

profilesName.map(profile => {
  profiles[profile] = {
    is: (value: string) => value === profile,
    findIn: (dragees: Dragee[]) => dragees.filter(dragee => dragee.profile === profile)
  }
  return profiles[profile];
})

export const profileOf = (dragee: Dragee, ...profilesFilter: Profile[]): boolean => 
  profilesFilter.map(kf => profiles[kf].is(dragee.profile)).some(b => b)