import { Client } from 'colyseus.js';
import { createContext } from 'react';

export const ClientContext = createContext<Client>(null);
