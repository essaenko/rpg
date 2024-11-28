import { Component } from '@client/core/ecs/component/component';
import Graphics = Phaser.GameObjects.Graphics;

export class TargetHighlightComponent extends Component {
  public rect: Graphics;
  constructor() {
    super('target-highlight');
  }

  onRemove() {
    super.onRemove();

    this.rect.destroy(true);
  }
}
