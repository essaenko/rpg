import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class EnemyKillEvent extends Component {
  constructor() {
    super('enemy-kill-event');
  }

  @type('string') killer: string;
  @type('string') victim: string;

  init(state: Record<string, any>) {}
}
