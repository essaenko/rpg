import {Observable} from "rxjs";
import {useEffect, useState} from "react";

export const useObservable = <T = any>(observable: Observable<T>): T => {
  const [state, setState] = useState<T>();
  useEffect(() => {
    observable.subscribe(setState);
  }, [])

  return state;
}