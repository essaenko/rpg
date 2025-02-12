import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'quest-book' },
    },
    {
      $push: {
        components: {
          name: 'quest-book',
          finished: [],
          ongoing: [],
        },
      } as any,
    },
  );
};
