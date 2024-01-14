import Color from 'colorjs.io';

import { type ReadonlyColor } from './color';

// color that will be converted to the "on" color
export const fill: ReadonlyColor = new Color('#000');
// color that will be converted to the "off" color (transparent)
export const transparency: ReadonlyColor = new Color('#fff');
