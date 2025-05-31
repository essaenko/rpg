import { Entity } from '@client/core/ecs/entity/entity';
import { Component } from '@client/core/ecs/component/component';
import { useContext, useEffect, useState } from 'react';
import { PlayerContext } from '@client/ui/context/player.context';

export const useComponentState = <T extends Component>(component?: Component): T => {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (!state && component) {
      component.on('component:change', () => {
        setState({ ...component } as T);
      });

      setState({ ...component } as T);
    }
    if (!component) {
      setState(null);
    }
  }, [component]);

  return state;
}

export const usePlayerComponentState = <T extends Component>(name: string): T | null => {
  const component = usePlayerComponent<T>(name);

  return useComponentState<T>(component);
}

export const usePlayerComponent = <T extends Component>(name: string): T | null => {
  const player = useContext(PlayerContext);

  return useComponent(player, name);
}

export const useComponent = <T extends Component>(entity: Entity, name: string): T | null => {
  const [state, setState] = useState(null);
  useEffect(() => {
    const component = entity?.get<T>(name);

    const onAdd = () => {
      const component = entity.get<T>(name);
      if (component) {
        setState(component);
        entity?.on('entity:components:remove', onRemove);
      }
    }
    const onRemove = () => {
      if (!entity.has(name)) {
        setState(null);
      }
    }

    if (component) {
      setState(component);
      entity?.on('entity:components:remove', onRemove);
    } else {
      entity?.on('entity:components:add', onAdd);
    }

    return () => {
      setState(null);
      entity?.detach('entity:components:add', onAdd);
      entity?.detach('entity:components:remove', onRemove);
    }
  }, [entity]);

  return state;
}