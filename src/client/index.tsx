import React from 'react';

import { createRoot } from 'react-dom/client';
import { GameUI } from './ui/app';

const root = createRoot(document.getElementById('ui-root'));
root.render(<GameUI />);
