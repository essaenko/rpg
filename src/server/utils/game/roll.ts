import { LootTableItem } from '@server/mongodb/types';

export const rollLoot = (lootTable: LootTableItem[], count: number): string[] => {
  const items: string[] = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let drop = null;

    for (const item of lootTable.filter((item) => !items.includes(item.item))) {
      if (roll <= item.chance) {
        drop = item.item;
      }
    }

    if (drop) {
      items.push(drop);
    }
  }

  return items;
};
