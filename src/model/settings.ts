import {
  computed,
  observable,
} from 'mobx';
import { type ColorScheme } from 'ui/color_scheme';
import { type FontFamily } from 'ui/font';

export type Fonts = {
  readonly body: FontFamily,
  readonly detail: FontFamily,
  readonly title: FontFamily,
};

export class Settings {
  @observable.ref
  accessor colorScheme: ColorScheme;

  @observable.ref
  accessor fonts: Fonts;

  @computed
  get foreground() {
    return this.colorScheme.foreground;
  }

  @computed
  get background() {
    return this.colorScheme.background;
  }

  @computed
  get backlit() {
    return this.colorScheme.backlit;
  }

  constructor(
    colorScheme: ColorScheme,
    fonts: Fonts,
  ) {
    this.colorScheme = colorScheme;
    this.fonts = fonts;
  }
}
