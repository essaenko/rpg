import PlayAnimationConfig = Phaser.Types.Animations.PlayAnimationConfig;
import { Component } from '@client/core/ecs/component/component';

export class AnimationComponent extends Component {
  public key: string = null;
  public config: PlayAnimationConfig = null;
  constructor() {
    super('animation');
  }
}
