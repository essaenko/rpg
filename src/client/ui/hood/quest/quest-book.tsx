import { PlayerContext } from '@client/ui/context/player.context';
import React, { useContext } from 'react';
import { QuestBook } from '@client/ecs/components/game/quest/quest-book';
import { QuestRequirementType } from '@shared/schemas/game/quest/types';
import { usePlayerComponent } from '@client/ui/hooks/component';
import { useSchemaState } from '@client/ui/hooks/schema';
import type { Quest } from '@shared/schemas/game/quest/quest';

import css from './quest.module.css';
import type { QuestRequirement as QuestRequirementSchema } from '@shared/schemas/game/quest/quest-requirement';

const QuestRequirement = ({ schema }: { schema: QuestRequirementSchema | null }) => {
  const requirement = useSchemaState(schema);
  return requirement && (
    <li>
      {requirementTypeToString(requirement.type)} {requirement.progress}/{requirement.amount} {requirement.req_id}
    </li>
  );
}

const QuestItem = ({ schema }: { schema: Quest | null }) => {
  const quest = useSchemaState(schema);
  const requirements = useSchemaState(quest?.requirements);


  return quest && (
    <li onClick={() => {}}>
      <h5>{quest.name}</h5>
      <p>{quest.short_description}</p>
      <ul>
        {requirements?.map((req, id) => {
          return (
            <QuestRequirement schema={req} key={id} />
          );
        })}
      </ul>
    </li>
  );
};

export const QuestBookUI: React.FC = () => {
  const player = useContext(PlayerContext);
  const bookComponent = usePlayerComponent<QuestBook>('quest-book');
  const quests = useSchemaState(bookComponent?.ongoing);

  return (
    <div className={css.book}>
      <h3>Задания</h3>
      <ul>
        {quests?.map((quest) => {
          return <QuestItem schema={quest} key={`${player.id}_${quest.id}`} />;
        })}
      </ul>
    </div>
  );
};

const requirementTypeToString = (req: QuestRequirementType): string => {
  switch (req) {
    case QuestRequirementType.ToHave:
      return 'Получить';
    case QuestRequirementType.ToKill:
      return 'Убить';
    case QuestRequirementType.ToVisit:
      return 'Посетить';
  }
};
