import css from '@client/ui/hood/inventory/bag/bag.module.css';
import React, { useCallback } from 'react';
import type { Stack } from '@shared/schemas/game/item/item';
import classNames from 'classnames';

export const BagUI = ({
  items,
  onClick,
  expanded = false,
}: {
  items: Stack[];
  onClick?: (stack: Stack) => void;
  expanded?: boolean;
}) => {
  return (
    <div className={css.root}>
      <div
        className={classNames(css.list, {
          [css.expanded]: expanded,
        })}
      >
        {items?.map((stack) => {
          const handle = useCallback(() => {
            if (onClick) {
              onClick(stack);
            }
          }, [stack, onClick]);

          return (
            <div className={css.item} key={stack.item.id} onClick={handle}>
              {stack.item.name} - x{stack.amount}
            </div>
          );
        })}
      </div>
    </div>
  );
};
