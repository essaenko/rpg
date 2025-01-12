import { Component } from '@shared/ecs/component';

export class ChangeSceneTrigger extends Component {
  public scene: string;
  constructor() {
    super('change-scene-trigger');
  }

  init(state: Record<string, any>): void {}
}
