import { Room } from 'colyseus.js';
import { createContext } from 'react';

export const RoomContext = createContext<Room>(null);
