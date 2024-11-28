import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import {
  isRoomSavedConfig,
  DBSavedRoomConfig,
  SavedRoomConfig,
  CharacterSave,
  isCharacterSave,
} from '@server/mongodb/types';
import { Entity } from '@shared/ecs/entity';
import { ColliderComponent } from '@server/ecs/components/physics/collider';

let instance: MDBClient;

export class MDBClient {
  private client: MongoClient;
  private db: Db;

  private constructor() {
    this.client = new MongoClient('mongodb://localhost:27017', {
      serverApi: ServerApiVersion.v1,
    });
    this.db = this.client.db('rpg');
  }

  public static instance(): MDBClient {
    if (!instance) {
      instance = new MDBClient();
    }

    return instance;
  }

  public async readMapConfig(key: string): Promise<SavedRoomConfig | undefined> {
    const col = this.db.collection('scenes');
    const mapConfig = await col.findOne({
      key,
    });

    if (isRoomSavedConfig(mapConfig)) {
      return {
        ...mapConfig,
        characters: mapConfig.characters.map((character) => ({
          id: character.id,
          components: new Map(character.components.map((c) => [c.name, c])),
        })),
      };
    }

    return undefined;
  }

  public async readPlayerSave(id: string): Promise<CharacterSave | undefined> {
    const col = this.db.collection('characters');
    const save = await col.findOne({
      id: id,
    });

    if (isCharacterSave(save)) {
      return {
        id,
        components: new Map(save.components.map((c) => [c.name, c])),
      };
    }

    return undefined;
  }

  public async writePlayerSave(entity: Entity): Promise<void> {
    const col = this.db.collection('characters');
    await col.updateOne(
      {
        id: 'character',
      },
      {
        $set: {
          id: 'character',
          components: Array.from(entity.components.entries()).map(([_, instance]) => instance.serialize()),
        },
      },
      {
        upsert: true,
      },
    );
  }
}
