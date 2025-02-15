import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'tag-player' },
    },
    {
      $push: {
        components: {
          name: 'tag-player',
        },
      } as any,
    },
  );
};
