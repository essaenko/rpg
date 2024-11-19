import {Schema, type, MapSchema} from "@colyseus/schema";
import { Entity } from "../ecs/entity";


export class SceneState extends Schema {
  @type({ map: Entity }) entities = new MapSchema<Entity>();
}