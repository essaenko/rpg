import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { QuestBook as QuestBookSchema } from '@server/ecs/components/game/quest/quest-book';
import { Quest } from '@shared/schemas/game/quest/quest';

export class QuestBook extends NetworkComponent {
  constructor() {
    super('quest-book');
  }

  public finished: Quest[] = [];
  public ongoing: Quest[] = [];
}
