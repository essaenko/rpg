import { Client, Room } from 'colyseus.js';
import type { SceneState } from '@shared/schemas/scene';

let instance: Networking = null;

export class Networking {
  private constructor() {}
  private _room: Room<SceneState> = null;
  private _client: Client;

  public static get instance(): Networking {
    if (!instance) {
      instance =  new Networking();
    }

    return instance;
  }

  public disconnect() {
    this._client = null;
  }

  public connect() {
    this._client = new Client(`ws://${location.hostname}:2567`);
  }

  public async joinRoom() {
    this._room = null;
    const response = await this._client.http.get('/join/usqPuANKq');

    if (response.statusCode === 200 && response.data) {
      try {
        const data = response.data;
        if ('room' in data && 'sessionId' in data && 'scene' in data) {
          this._room = await this._client.consumeSeatReservation<SceneState>(data);

          return { room: this._room, scene: data.scene };
        }
      } catch (e) {
        console.error(e);
        alert('Error');
        return null;
      }
    }
  }

  public async leave() {
    await this._room?.leave();

    this._room = null;
  }

  public get room(): Room<SceneState> | null {
    return this._room;
  }
}