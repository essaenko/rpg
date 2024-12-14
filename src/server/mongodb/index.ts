import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { EntitySave, isEntitySave, isQuest, QuestSave } from '@server/mongodb/types';
import { Entity } from '@shared/ecs/entity';

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

  public async readQuest(id: string): Promise<QuestSave | undefined> {
    const col = this.db.collection('quests');
    const config = await col.findOne({
      id,
    });

    if (isQuest(config)) {
      return config;
    }

    return undefined;
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

  public async readPlayer(id: string): Promise<EntitySave | undefined> {
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

  public async writePlayer(entity: Entity): Promise<void> {
    const col = this.db.collection('characters');
    await col.updateOne(
      {
        id: 'character',
      },
      {
        $set: {
          id: 'character',
          components: Array.from(entity.components.values())
            .filter((component) => component.serializable)
            .map((component) => component.serialize()),
        },
      },
      {
        upsert: true,
      },
    );
  }
}
