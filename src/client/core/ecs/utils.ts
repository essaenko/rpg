import type { Entity } from '@shared/ecs/entity';
import { Component } from '@shared/ecs/component';

export const getSchemaComponent = <T extends Component>(schema: Entity, name: string): T | undefined => {
  return schema.components.find(({ name: n }) => n === name) as T | undefined;
};
