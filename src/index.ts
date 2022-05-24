import './style.css';

import { App } from './App';

const canvas = document.querySelector<HTMLDivElement>('#canvas');

canvas && new App(canvas);
