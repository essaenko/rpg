import { migration } from './bag.migration';

migration().finally(() => {
  console.log('Migration finished');
});
