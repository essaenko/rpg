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
}
