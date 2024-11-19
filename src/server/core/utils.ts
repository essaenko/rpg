import { TransportEventTypes } from "../../shared/types";

export const isTransportEventType = (val: unknown): val is TransportEventTypes => {
  return TransportEventTypes[val as  keyof typeof TransportEventTypes] !== undefined;
}