import { observable } from 'mobx';
import { type ColorScheme } from 'ui/color_scheme';
import { type FontFamily } from 'ui/font';

export class Settings {
  @observable.ref
    colorScheme: ColorScheme;

  @observable.ref
    body: FontFamily;

  constructor(
    colorScheme: ColorScheme,
    body: FontFamily,
  ) {
    this.colorScheme = colorScheme;
    this.body = body;
  }
}
