import { observable } from 'mobx';
import { type ComponentType } from 'react';

export class ContentHolder {
  @observable.ref
    Content: ComponentType | undefined;
}
