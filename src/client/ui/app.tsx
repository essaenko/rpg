import React, {useMemo} from 'react';
import {Observable} from "rxjs";
import {useObservable} from "./utils/useObservable";
import {LoginScreen} from "./login-screen/login-screen";

export type AppProps = {
  scene: Observable<string>
}

export const App = (props: AppProps) => {
  const scene = useObservable(props.scene);
  let component = useMemo(() => {
    switch (scene) {
      case 'login-screen':
        return <LoginScreen />;
      default:
        return null;
    }
  }, [scene]);

  return <div>
    {component}
  </div>
}