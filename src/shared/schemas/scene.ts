import { Schema, type, MapSchema, view } from '@colyseus/schema';
import { Entity } from '../ecs/entity';

export class SceneState extends Schema {
  @type('string') roomName: string = '';
  @view() @type({ map: Entity }) entities = new MapSchema<Entity>();
}
