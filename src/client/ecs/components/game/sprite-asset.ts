import { Component } from '@client/core/ecs/component/component';

export class SpriteAssetComponent extends Component {
  public loaded: boolean = false;
  public loading: boolean = false;

  constructor(
    public key: string,
    public url: string,
  ) {
    super('sprite-asset');
  }
}
