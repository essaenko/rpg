import { Character } from './character';
import { NPCComponent } from '../components/game/tags/npc';
import { nanoid } from 'nanoid';

export class Npc extends Character {
  constructor() {
    super();
    this.id = nanoid(9);
    this.addComponent(new NPCComponent());
  }
}
