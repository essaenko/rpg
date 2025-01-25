import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { QuestBook as QuestBookSchema } from '@server/ecs/components/game/quest/quest-book';
import { Quest } from '@shared/schemas/game/quest/quest';

export class QuestBook extends NetworkComponent {
  constructor() {
    super('quest-book');
  }

  public finished: Quest[] = [];
  public ongoing: Quest[] = [];

  observe(schema: QuestBookSchema): void {
    schema.finished.onAdd((item) => {
      this.finished.push(item);
    }, false);
    schema.finished.onRemove((item) => {
      this.finished.splice(this.finished.indexOf(item), 1);
    });
    schema.ongoing.onAdd((item) => {
      this.ongoing.push(item);
    }, false);
    schema.ongoing.onRemove((item) => {
      this.ongoing.splice(this.ongoing.indexOf(item), 1);
    });
  }
}
