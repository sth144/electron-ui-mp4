import "reflect-metadata";
/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '@public/style.scss';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@renderer/app';

const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(<App />);
