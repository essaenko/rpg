import React from 'react';

import {createRoot} from "react-dom/client";
import {App, AppProps} from "./app";



export const InitUI = (props: AppProps) => {
  const root = createRoot(document.querySelector('#ui-root'))
  root.render(<App scene={props.scene}></App>)
}