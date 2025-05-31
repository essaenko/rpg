import { Component } from '@client/core/ecs/component/component';
import Graphics = Phaser.GameObjects.Graphics;
import Image = Phaser.Physics.Arcade.Image;

export class TargetHighlight extends Component {
  public rect: Phaser.GameObjects.Image;
  constructor() {
    super('target-highlight');
  }

  destroy() {
    super.destroy();

    this.rect?.destroy(true);
  }
}
