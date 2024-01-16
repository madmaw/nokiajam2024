import {
  useEffect,
  useMemo,
} from 'react';
import {
  type Observable,
  type Observer,
  Subject,
} from 'rxjs';

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
  Back,
}

export type MaybeWithInput<T = {}> = T & ({
  readonly input: Observable<Input> | undefined;
  readonly output: Observer<Input> | undefined,
});

export function useOutput(
    output: Observer<Input> | undefined,
    handler: (input: Input) => boolean | undefined,
): Observer<Input> {
  const input = useMemo(function() {
    return new Subject<Input>();
  }, []);
  useInput(input, output, handler);
  return input;
}

export function useInput(
    input: Observable<Input> | undefined,
    output: Observer<Input> | undefined,
    handler: (input: Input) => boolean | undefined,
) {
  useEffect(function () {
    if (input == null) {
      return;
    }
    const subscription = input.subscribe(function (input) {
      if (!handler(input)) {
        output?.next(input);
      }
    });
    return subscription.unsubscribe.bind(subscription);
  });
}
