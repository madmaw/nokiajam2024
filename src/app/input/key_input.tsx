import { useEffect } from 'react';
import { type Observer } from 'rxjs';
import {
  type Input,
  InputAction,
} from 'ui/input';

export type KeyInputProps = {
  input: Observer<Input>,
};

const KeyActions: Record<string, InputAction | undefined> = {
  'ArrowUp': InputAction.Up,
  'ArrowDown': InputAction.Down,
  'ArrowLeft': InputAction.Left,
  'ArrowRight': InputAction.Right,
  ' ': InputAction.Select,
  'Enter': InputAction.Select,
};

export function KeyInput({
  input,
}: KeyInputProps) {
  useEffect(function () {
    function onKeyDown(e: KeyboardEvent) {
      const action = KeyActions[e.key];
      console.log(e.key, action);
      if (action != null) {
        input.next({
          action,
          down: true,
          source: e.key,
        });
        e.preventDefault();
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      const action = KeyActions[e.key];
      if (action != null) {
        input.next({
          action,
          down: false,
          source: e.key,
        });
        e.preventDefault();
      }
    }
    const options = {
      passive: false,
    };
    window.addEventListener('keydown', onKeyDown, options);
    window.addEventListener('keyup', onKeyUp, options);
    return function () {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [input]);
  return null;
}
