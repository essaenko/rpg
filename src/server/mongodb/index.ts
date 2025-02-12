import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import {
  EntitySave,
  isEntitySave,
  isItem,
  isLootTable,
  isQuest,
  ItemSave,
  LootTableSave,
  QuestSave,
} from '@server/mongodb/types';
import { Entity } from '@shared/ecs/entity';

let instance: MDBClient;

export class MDBClient {
  private _client: MongoClient;
  private _db: Db;

  private constructor() {
    this._client = new MongoClient(process.env['MONGO_DB_LOCATION_URI']);
    this._db = this._client.db('rpg');

    this.initializeDB();
  }

  public static instance(): MDBClient {
    if (!instance) {
      instance = new MDBClient();
    }

    return instance;
  }

  public get db() {
    return this._db;
  }

  public async readLootTable(id: string): Promise<LootTableSave | undefined> {
    const col = this._db.collection('loot-tables');
    const config = await col.findOne({
      id,
    });

    if (isLootTable(config)) {
      return config;
    }

    return undefined;
  }

  public async readQuest(id: string): Promise<QuestSave | undefined> {
    const col = this._db.collection('quests');
    const config = await col.findOne({
      id,
    });

    if (isQuest(config)) {
      return config;
    }

    return undefined;
  }

  public async readNPC(id: string): Promise<EntitySave | undefined> {
    const col = this._db.collection('npc');
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
    const col = this._db.collection('characters');
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

  public async readItem(id: string): Promise<ItemSave | undefined> {
    const col = this._db.collection('items');
    const item = await col.findOne({
      id,
    });

    if (isItem(item)) {
      return item;
    }

    return undefined;
  }

  public async itemExists(id: string): Promise<boolean> {
    return !!(await this.db.collection('items').findOne({ id }));
  }

  public async writePlayer(entity: Entity): Promise<void> {
    const col = this._db.collection('characters');
    await col.updateOne(
      {
        id: entity.id,
      },
      {
        $set: {
          id: entity.id,
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

  private async initializeDB() {
    (await this._db.collections()).forEach(async (col) => {
      if (!col.indexExists('id')) {
        await col.createIndex('id', {
          unique: true,
        });
      }
    });
  }
}
