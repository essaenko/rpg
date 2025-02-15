import { ResourceType } from '@shared/types';
import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'health' },
    },
    {
      $push: {
        components: {
          name: 'health',
          current: 150,
          max: 150,
        },
      } as any,
    },
  );
  await collection.updateMany(
    {
      'components.name': { $ne: 'resource' },
    },
    {
      $push: {
        components: {
          name: 'resource',
          current: 150,
          max: 150,
          type: ResourceType.Rage,
        },
      } as any,
    },
  );

  await collection.updateMany(
    {
      'components.name': { $ne: 'name' },
    },
    {
      $push: {
        components: {
          name: 'name',
          value: 'Ярополк',
        },
      } as any,
    },
  );
};
