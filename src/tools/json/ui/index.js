// import { Entity } from '@shared/ecs/entity';
// import { nanoid } from 'nanoid';
// import { NPC } from '@server/ecs/components/game/tag/npc';
// import { Move } from '@server/ecs/components/game/move';
// import { Name } from '@server/ecs/components/game/ui/name';
// import { Body } from '@server/ecs/components/physics/body';
// import { Position } from '@server/ecs/components/physics/position';
// import { Collider } from '@server/ecs/components/physics/collider';
// import { Health } from '@server/ecs/components/game/stats/health/health';
// import { Speed } from '@server/ecs/components/physics/speed';
// import { Resource } from '@server/ecs/components/game/stats/resource/resource';
// import { Animation, Class as Classes, Fraction as Fractions, ResourceType } from '@shared/types';
// import { MainStats } from '@server/ecs/components/game/stats/main-stats';
// import { SecondaryStats } from '@server/ecs/components/game/stats/secondary-stats';
// import { Fraction } from '@server/ecs/components/game/mechanics/fraction';
// import { Appearance } from '@server/ecs/components/game/appearance';
// import { Class } from '@server/ecs/components/game/mechanics/class';

import { map } from '@client/assets/sprites/map';

(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const spriteSelector = document.querySelector('#sprite-select');

    Object.keys(map).forEach((key) => {
      const option = document.createElement('option');
      option.innerText = key;
      option.value = key;

      spriteSelector.appendChild(option);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault(); // предотвращает отправку формы

      const spriteFile = document.getElementById('sprite-select').value;
      const name = document.getElementById('name').value;
      const characterClass = parseFloat(document.getElementById('class').value);
      const fraction = parseFloat(document.getElementById('fraction').value);

      const bodyWidth = parseFloat(document.getElementById('body-width').value);
      const bodyHeight = parseFloat(document.getElementById('body-height').value);

      const colliderX = parseFloat(document.getElementById('collider-x').value);
      const colliderY = parseFloat(document.getElementById('collider-y').value);
      const colliderWidth = parseFloat(document.getElementById('collider-width').value);
      const colliderHeight = parseFloat(document.getElementById('collider-height').value);

      const agility = parseFloat(document.getElementById('agility').value);
      const strength = parseFloat(document.getElementById('strength').value);
      const intelligence = parseFloat(document.getElementById('intelligence').value);

      const armor = parseFloat(document.getElementById('armor').value);
      const attackPower = parseFloat(document.getElementById('attackPower').value);
      const crit = parseFloat(document.getElementById('crit').value);
      const avoid = parseFloat(document.getElementById('avoid').value);
      const block = parseFloat(document.getElementById('block').value);
      const spellPower = parseFloat(document.getElementById('spellPower').value);
      const parry = parseFloat(document.getElementById('parry').value);

      fetch('http://localhost:2567/admin/character/generate', {
        method: 'POST',
        body: JSON.stringify({
          sprite: spriteFile,
          name,
          characterClass,
          fraction,
          bodyWidth,
          bodyHeight,
          colliderX,
          colliderY,
          colliderWidth,
          colliderHeight,
          agility,
          strength,
          intelligence,
          armor,
          attackPower,
          crit,
          avoid,
          block,
          spellPower,
          parry,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.status === 200) {
          res.text().then((data) => {
            document.querySelector('#result').innerText = data;
          });
        }
      });
    });
  });
})();
