import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'body' },
    },
    {
      $push: {
        components: {
          name: 'body',
          width: 64,
          height: 64,
        },
      } as any,
    },
  );
  await collection.updateMany(
    {
      'components.name': { $ne: 'position' },
    },
    {
      $push: {
        components: {
          name: 'position',
          x: 64,
          y: 64,
        },
      } as any,
    },
  );
  await collection.updateMany(
    {
      'components.name': { $ne: 'collider' },
    },
    {
      $push: {
        components: {
          name: 'collider',
          x: 22,
          y: 40,
          width: 20,
          height: 24,
        },
      } as any,
    },
  );
  await collection.updateMany(
    {
      'components.name': { $ne: 'speed' },
    },
    {
      $push: {
        components: {
          name: 'speed',
          speed: 1,
        },
      } as any,
    },
  );
  await collection.updateMany(
    {
      'components.name': { $ne: 'velocity' },
    },
    {
      $push: {
        components: {
          name: 'velocity',
        },
      } as any,
    },
  );
  await collection.updateMany(
    {
      'components.name': { $ne: 'move' },
    },
    {
      $push: {
        components: {
          name: 'move',
        },
      } as any,
    },
  );
};
