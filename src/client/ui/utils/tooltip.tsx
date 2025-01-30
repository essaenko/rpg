import React, { ReactNode } from 'react';

import css from './tooltip.module.css';
import classNames from 'classnames';

type Props = {
  children?: ReactNode;
  tooltip?: ReactNode;
  className?: string;
};

export const Tooltip: React.FC<Props> = ({ children, tooltip, className }) => {
  return (
    <div className={classNames(css.root, className)}>
      <div className={css.body}>{tooltip}</div>
      <div className={css.main}>{children}</div>
    </div>
  );
};
