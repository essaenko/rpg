import { Character } from './character';
import { PlayerComponent } from '../components/game/tags/player';
import { MoveComponent } from '../components/game/move';

export class Player extends Character {
  constructor() {
    super();

    this.addComponent(new PlayerComponent());
    this.addComponent(new MoveComponent());
  }
}
