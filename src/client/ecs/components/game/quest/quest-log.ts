import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { QuestLog as QuestLogSchema } from '@server/ecs/components/game/quest/quest-log';

export class QuestLog extends NetworkComponent {
  constructor() {
    super('quest-log');
  }

  public finished: string[] = [];
  public ongoing: string[] = [];

  observe(schema: QuestLogSchema): void {
    schema.finished.onAdd((item) => {
      this.finished.push(item);
    });
    schema.finished.onRemove((item) => {
      this.finished.splice(this.finished.indexOf(item), 1);
    });
    schema.ongoing.onAdd((item) => {
      this.ongoing.push(item);
    });
    schema.ongoing.onRemove((item) => {
      this.ongoing.splice(this.ongoing.indexOf(item), 1);
    });
  }
}
