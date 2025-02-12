import { Client } from 'colyseus';
import { Service } from './service';

export class ClientsService extends Service {
  private _list: Map<string, Client> = new Map();
  constructor() {
    super('clients');
  }

  register(client: Client): Client {
    this._list.set(client.sessionId, client);

    return client;
  }

  unregister(client: Client): void {
    this._list.delete(client.sessionId);
  }

  get(sessionId: string): Client {
    return this._list.get(sessionId);
  }

  get list(): Map<string, Client> {
    return this._list;
  }
}
