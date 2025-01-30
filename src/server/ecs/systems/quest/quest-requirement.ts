import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { QuestRequirementType } from '@shared/schemas/game/quest/types';
import { QuestBook } from '@server/ecs/components/game/quest/quest-book';
import { Inventory } from '@server/ecs/components/game/item/inventory';

export class QuestRequirementSystem extends System {
  constructor() {
    super('quest-requirement');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['quest-book', 'inventory']).forEach((entity) => {
      const book = entity.get<QuestBook>('quest-book');
      const inventory = entity.get<Inventory>('inventory');

      if (
        book.ongoing.some(({ requirements }) => requirements.some(({ type }) => type === QuestRequirementType.ToHave))
      ) {
        const quests = book.ongoing.filter(({ requirements }) =>
          requirements.some(({ type }) => type === QuestRequirementType.ToHave),
        );

        quests.forEach((quest) => {
          const toHaveReq = quest.requirements.filter(({ type }) => type === QuestRequirementType.ToHave);

          toHaveReq.forEach((req) => {
            if (inventory.items.some((item) => item.item.id === req.req_id)) {
              const item = inventory.items.find(({ item: { id } }) => id === req.req_id).item;
              const items = inventory.items.filter(({ item: { id } }) => id === item.id);
              const itemAmount = item.stackable
                ? items.reduce((acc, stack) => {
                    acc += stack.amount;

                    return acc;
                  }, 0)
                : items.length;

              req.progress = Math.min(itemAmount, req.amount);
            }
          });
        });
      }
    });
  }
}
