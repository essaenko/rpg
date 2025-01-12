import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { Level as LevelSchema } from '@server/ecs/components/game/level';

export class Level extends NetworkComponent {
  constructor() {
    super('level');
  }

  public level: number = 1;
  public exp: number = 0;

  observe(schema: LevelSchema) {
    schema.onChange(() => {
      this.exp = schema.exp;
      this.level = schema.level;
    });
  }
}
