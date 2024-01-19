import {
  action,
  observable,
} from 'mobx';
import { type Screen } from 'ui/stack/stack';

export class ContentHolder {
  @observable.ref
  accessor screens: readonly Screen[] = [];
}

export class ContentController {
  constructor(
    private readonly holder: ContentHolder,
  ) {

  }

  @action
  pushScreen(screen: Screen): void {
    this.holder.screens = [
      ...this.holder.screens,
      screen,
    ];
  }

  @action
  popScreen(): void {
    this.holder.screens = this.holder.screens.slice(0, -1);
  }
}
