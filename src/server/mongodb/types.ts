export type SavedRoomConfig = { key: string; characters: EntitySave[] };
export type EntitySave = { id: string; components: Record<string, any>[] };

export const isRoomSavedConfig = (data: unknown): data is SavedRoomConfig => {
  return typeof data === 'object' && 'key' in data && 'characters' in data;
};

export const isEntitySave = (save: unknown): save is EntitySave => {
  return typeof save === 'object' && save != null && 'components' in save;
};
