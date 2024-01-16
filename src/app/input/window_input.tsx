import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { type Observer } from 'rxjs';
import {
  type Input,
  InputAction,
  InputProgress,
} from 'ui/input';

export type KeyInputProps = {
  input: Observer<Input>,
};

type InputRules = {
  action: InputAction,
}

type KeyPress = {
  key: string,
  timestamp: number,
}

const KeyActions: Record<string, InputRules | undefined> = {
  'ArrowUp': {
    action: InputAction.Up,
  },
  'ArrowDown': {
    action: InputAction.Down,
  },
  'ArrowLeft': {
    action: InputAction.Left,
  },
  'ArrowRight': {
    action: InputAction.Right,
  },
  ' ': {
    action: InputAction.Select,
  },
  'Enter': {
    action: InputAction.Select,
  },
  'Escape': {
    action: InputAction.Back,
  },
};

export function WindowInput({
  input,
}: KeyInputProps) {
  const [
    keyPress,
    setKeyPress,
  ] = useState<KeyPress | null>(null);

  const onKeyDown = useCallback(function (e: KeyboardEvent) {
    const rules = KeyActions[e.key];
    if (rules != null) {
      const {
        action,
      } = rules;
      if (keyPress?.key !== e.key) {
        input.next({
          action,
          progress: InputProgress.Start,
          source: e.key,
        });

        setKeyPress({
          timestamp: e.timeStamp,
          key: e.key,
        });
      }
      e.preventDefault();
    }
  }, [
    input,
    keyPress,
    setKeyPress,
  ]);

  const onKeyUp = useCallback(function (e: KeyboardEvent) {
    const rules = KeyActions[e.key];
    if (rules != null) {
      const {
        action,
      } = rules;
      input.next({
        action,
        progress: InputProgress.Stop,
        source: e.key,
      });
      e.preventDefault();
      // have clicked without doing anything else
      if (keyPress?.key === e.key) {
        input.next({
          action,
          progress: InputProgress.Commit,
          source: e.key,
        });
      }
      setKeyPress(null);
    }
  }, [
    input,
    keyPress,
  ]);

  const onWheel = useCallback(function (e: WheelEvent) {
    const {
      deltaY,
    } = e;
    const delta = Math.round(deltaY / 100);
    new Array(Math.abs(delta)).fill(0).forEach(function () {
      input.next({
        action: delta > 0 ? InputAction.Down : InputAction.Up,
        progress: InputProgress.Commit,
        source: 'wheel',
      });
    });
    e.preventDefault();
  }, [input]);

  useEffect(function () {
    const options = {
      passive: false,
    };
    window.addEventListener('keydown', onKeyDown, options);
    window.addEventListener('keyup', onKeyUp, options);
    window.addEventListener('wheel', onWheel, options);
    return function () {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('wheel', onWheel);
    };
  }, [
    input,
    onKeyDown,
    onKeyUp,
    onWheel,
  ]);
  return null;
}
