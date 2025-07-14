import e from 'express';
import { characterRoutes } from './character/character-creator';

export const admin = (): e.Router => {
  const router = e.Router();

  characterRoutes(router);

  return router;
};
