export type DBSavedRoomConfig = { key: string; characters: DBCharacterSave[] };
export type SavedRoomConfig = { key: string; characters: CharacterSave[] };
export type DBCharacterSave = { components: Record<string, any> };
export type CharacterSave = { components: Map<string, any> };

export const isRoomSavedConfig = (data: unknown): data is DBSavedRoomConfig => {
  return typeof data === 'object' && 'key' in data && 'characters' in data;
};

export const isCharacterSave = (save: unknown): save is DBCharacterSave => {
  return typeof save === 'object' && save != null && 'components' in save;
};
