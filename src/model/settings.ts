import { observable } from 'mobx';
import { type ColorScheme } from 'ui/color_scheme';
import { type FontFamily } from 'ui/font';

export class Settings {
  @observable.ref
  accessor colorScheme: ColorScheme;

  @observable.ref
  accessor invertColorScheme: boolean = false;

  @observable.ref
  accessor body: FontFamily;

  get foreground() {
    return this.invertColorScheme
      ? this.colorScheme.background
      : this.colorScheme.foreground;
  }

  get background() {
    return this.invertColorScheme
      ? this.colorScheme.foreground
      : this.colorScheme.background;
  }

  constructor(
    colorScheme: ColorScheme,
    body: FontFamily,
  ) {
    this.colorScheme = colorScheme;
    this.body = body;
  }
}
