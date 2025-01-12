import React, { useMemo } from 'react';
import { Observable } from 'rxjs';
import { useObservable } from './utils/useObservable';
import { LoginScreen } from './login-screen/login-screen';
import { Hood } from '@client/ui/hood/hood';

export type AppProps = {
  scene: Observable<string>;
};

export const App = (props: AppProps) => {
  const scene = useObservable(props.scene);
  let component = useMemo(() => {
    switch (scene) {
      case 'login-screen':
        return <LoginScreen />;
      default:
        return <Hood />;
    }
  }, [scene]);

  return <div>{component}</div>;
};
