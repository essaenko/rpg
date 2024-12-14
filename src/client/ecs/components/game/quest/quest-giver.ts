import { NetworkComponent } from '@client/core/ecs/component/network-component';

import { QuestGiver as QuestGiverSchema } from '@server/ecs/components/game/quest/quest-giver';
import type { Quest } from '@shared/schemas/game/quest/quest';

export class QuestGiver extends NetworkComponent {
  constructor() {
    super('quest-giver');
  }

  quests: Quest[] = [];

  observe(schema: QuestGiverSchema): void {
    schema.quests.onAdd((item) => {
      this.quests.push(item);
    }, false);

    schema.quests.onRemove((item) => {
      this.quests.splice(this.quests.indexOf(item), 1);
    });
  }
}
