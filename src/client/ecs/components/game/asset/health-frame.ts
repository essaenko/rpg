import { Component } from '@client/core/ecs/component/component';
import HealthFrameSprite from '@client/assets/sprites/UI/health_frame.png';
import Group = Phaser.GameObjects.Group;

export class HealthFrameComponent extends Component {
  public asset = {
    loading: false,
    loaded: false,
    key: 'health-frame',
    url: HealthFrameSprite,
    config: {
      frameWidth: 20,
      frameHeight: 10,
    },
  };
  public sprite: Group;

  constructor() {
    super('health-frame');
  }

  destroy() {
    super.destroy();

    this.sprite.destroy(true);
  }
}
