import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { RoomContext } from '@client/ui/context/room.context';
import { getStateCallbacks } from 'colyseus.js';
import { ArraySchema, MapSchema, Schema } from '@colyseus/schema';

type ColyseusSchemaType = ArraySchema | MapSchema | Schema;

export const isColyseusSchema = (schema: unknown): schema is ColyseusSchemaType =>
  schema instanceof Schema || schema instanceof ArraySchema || schema instanceof MapSchema;

export function useSchemaState<T extends unknown>(schema: T): T | null;
export function useSchemaState<T extends unknown>(schema: T, key: keyof T): T[typeof key] | null;
export function useSchemaState<T extends unknown>(schema: T | null, key?: keyof T) {
  const room = useContext(RoomContext);
  const $ = useMemo(() => (room ? getStateCallbacks(room) : null), [room]);
  const [state, setState] = useState(null);

  const onChange = useCallback(() => {
    if (schema instanceof ArraySchema) {
      setState([...schema]);
    }
    if (schema instanceof MapSchema) {
      setState({ ...schema });
    }
  }, [schema]);

  useEffect(() => {
    if ($ && schema && isColyseusSchema(schema)) {
      if (key) {
        $(schema).listen(key, (value: T[typeof key]) => {
          setState(value);
        });
      } else {
        if (!(schema instanceof Schema)) {
          $(schema).onAdd(onChange);
          $(schema).onRemove(onChange);
        } else {
          $(schema).onChange(() => {
            setState({ ...(schema as any) });
          });
          setState({ ...(schema as any) });
        }
      }
    }
  }, [$, schema, key, onChange]);

  return state;
}
