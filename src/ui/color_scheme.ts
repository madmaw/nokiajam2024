import { type ReadonlyColor } from 'base/color';

export type ColorScheme = {
  readonly name: string,
  readonly foreground: ReadonlyColor;
  readonly background: ReadonlyColor;
};
