import { type ComponentType } from 'react';
import { type Observable } from 'rxjs';
import { type Input } from 'ui/input';

export type ScreenProps = {
  input: Observable<Input> | undefined;
};

export type ScreenComponent = ComponentType<ScreenProps>;
