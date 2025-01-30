import { Entity } from '@client/core/ecs/entity/entity';
import { createContext } from 'react';

export const PlayerContext = createContext<Entity>(null);
