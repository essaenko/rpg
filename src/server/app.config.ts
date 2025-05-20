import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';

import { assets } from '@shared/maps/mapping';

/**
 * Import your Room files
 */
import { DynamicallyLoadableScene } from '@server/core/scene/dynamicly-loadable-scene';
import { matchMaker } from 'colyseus';
import { MDBClient } from '@server/mongodb';
import { Entity } from '@shared/ecs/entity';
import { Location } from '@server/ecs/components/game/ui/location';

export default config({
  initializeGameServer: (gameServer) => {
    matchMaker.controller.exposedMethods = ['reconnect'];
    /**
     * Define your room handlers:
     */
    Object.keys(assets).forEach((location) => {
      gameServer.define(location, DynamicallyLoadableScene);
    })

    // gameServer.simulateLatency(100);
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    app.get('/hello_world', (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });
    app.get('/scene', (req, res) => {
      res.send(JSON.stringify({ scene: 'dummy' }));
    });
    app.get('/join/:charID', async (req, res) => {
      if (req.params.charID) {
        const save = await MDBClient.instance().readPlayer(req.params.charID);

        if (save) {
          const entity = new Entity();
          entity.init(save);

          const location = entity.get<Location>('location');

          if (location && location.value) {
            const seat = await matchMaker.joinOrCreate(location.value, {
              scene: location.value,
            });

            // if (seat.room.maxClients == null) {
            //   seat.room.maxClients = 50;
            // }

            res.json({
              ...seat,
              scene: location.value
            });

            return;
          }
        }
      }

      res.status(400);
      res.json({
        status: 'error',
        error: 'Cant join the game',
      })
    })

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== 'production') {
      app.use('/', playground());
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use('/monitor', monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
