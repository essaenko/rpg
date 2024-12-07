import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { isRoomSavedConfig, SavedRoomConfig, EntitySave, isEntitySave } from '@server/mongodb/types';
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

  public async readNPC(id: string): Promise<EntitySave | undefined> {
    const col = this.db.collection('npc');
    const config = await col.findOne({
      id,
    });

    if (isEntitySave(config)) {
      return {
        id,
        components: config.components,
      };
    }

    return undefined;
  }

  public async readPlayerSave(id: string): Promise<EntitySave | undefined> {
    const col = this.db.collection('characters');
    const save = await col.findOne({
      id: id,
    });

    if (isEntitySave(save)) {
      return {
        id,
        components: save.components,
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
