import React from 'react';

import css from './modal.module.css';
import classNames from 'classnames';

export const Modal: React.FC<
  React.PropsWithChildren<{ isOpen: boolean; onClose?: () => void; className?: string }>
> = ({ isOpen, children, className, onClose }) => {
  return isOpen ? (
    <div className={classNames(css.root, className)}>
      <i onClick={() => onClose?.()}>&#x2715;</i>
      {children}
    </div>
  ) : null;
};
