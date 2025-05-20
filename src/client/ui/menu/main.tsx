import React, { useCallback, useContext, useEffect, useState } from 'react';

import css from './main.module.css';
import { Networking } from '@client/services/networking';

export const MainMenu: React.FC = () => {
  const room = Networking.instance.room;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onDisconnect = useCallback(() => {
    if (room) {
      room.leave();
      setOpen(false);
    }
  }, [room]);

  const onConnect = useCallback(() => {
    location.reload();
  }, [location]);

  return (
    open && (
      <div className={css.root}>
        <h1>Меню</h1>
        <ul>
          {room?.connection.isOpen && <li onClick={onDisconnect}>Отключиться</li>}
          {!room?.connection.isOpen && <li onClick={onConnect}>Подключиться</li>}
        </ul>
      </div>
    )
  );
};
