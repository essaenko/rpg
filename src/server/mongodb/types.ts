export type EntitySave = { id: string; components: Record<string, any>[] };

export const isEntitySave = (save: unknown): save is EntitySave => {
  return typeof save === 'object' && save != null && 'components' in save;
};

export type QuestSave = {
  name: string;
  short_description: string;
  description: string;
  rewards: [];
  requirements?: [];
  conditions?: [];
};

export const isQuest = (config: unknown): config is QuestSave => {
  return config && typeof config === 'object' && 'rewards' in config && 'description' in config;
};
