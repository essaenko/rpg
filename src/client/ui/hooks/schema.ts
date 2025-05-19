import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStateCallbacks } from 'colyseus.js';
import { $changes, $encoder, ArraySchema, MapSchema, Schema } from '@colyseus/schema';
import { isNonFunctionProperty } from '@client/utils/types';
import { NonFunctionPropNames } from '@colyseus/schema/lib/types/HelperTypes';
import { Networking } from '@client/services/networking';

type ColyseusSchemaType = ArraySchema | MapSchema | Schema;

export const isColyseusSchema = (schema: unknown): schema is ColyseusSchemaType =>
  schema instanceof Schema || schema instanceof ArraySchema || schema instanceof MapSchema;

export function useSchemaState<T extends unknown>(schema: T): T | null;
export function useSchemaState<T extends unknown, K extends keyof T>(schema: T, key: K): T[K] | null;

export function useSchemaState<T extends unknown, K extends keyof T>(schema: T | null, key?: K): T | T[K] | null {
  const room = Networking.instance.room;
  const $ = useMemo(() => (room ? getStateCallbacks(room) : null), [room]);
  const [state, setState] = useState(null);

  const onChange = useCallback(
    (value?: T[K]) => {
      if (schema instanceof Schema) {
        if (key) {
          setState(value);
        } else {
          setState({ ...schema });
        }
      }
      if (schema instanceof ArraySchema) {
        setState([...schema]);
      }
      if (schema instanceof MapSchema) {
        setState({ ...schema });
      }
    },
    [schema, key],
  );

  useEffect(() => {
    const toDispose: (() => void)[] = [];
    if (room && $ && schema && isColyseusSchema(schema)) {
      if (key && schema instanceof Schema && isNonFunctionProperty<typeof schema>(key, schema)) {
        // @ts-ignore
        $(schema).listen(key as NonFunctionPropNames<T & Schema>, onChange);
      } else {
        if (!(schema instanceof Schema)) {
          // @ts-ignore
          toDispose.push($(schema).onAdd(onChange));
          // @ts-ignore
          toDispose.push($(schema).onRemove(onChange));
        } else {
          toDispose.push($(schema).onChange(onChange));
          setState({ ...schema });
        }
      }
    }

    return () => {
      for (const dispose of toDispose) {
        dispose();
      }
    };
  }, [$, schema, key, onChange, room]);

  return state;
}
