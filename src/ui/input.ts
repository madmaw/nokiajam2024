import { type Observable } from 'rxjs';

export const enum InputProgress {
  Start,
  Stop,
  Commit,
}

export type Input = {
  action: InputAction,
  source: string,
  progress: InputProgress,
}

export const enum InputAction {
  Up,
  Down,
  Left,
  Right,
  Select,
}

export type MaybeWithInput<T = {}> = T & {
  readonly input: Observable<Input> | undefined;
};
