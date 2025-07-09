import { Schema, type, MapSchema, view } from '@colyseus/schema';
import { EntitySchema } from '../ecs/entity';

export class SceneState extends Schema {
  @type('string') roomName: string = '';
  /*  */ @view() @type({ map: EntitySchema }) entities = new MapSchema<EntitySchema>();
}
