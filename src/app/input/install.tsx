import { createPartialObserverComponent } from 'base/react/partial';
import {
  type Observable,
  Subject,
} from 'rxjs';
import { type Input } from 'ui/input';

import { KeyInput } from './key_input';

export function install(): {
  KeyInstaller: React.ComponentType,
  input: Observable<Input>,
  } {
  const inputSubject = new Subject<Input>();
  const KeyInstaller = createPartialObserverComponent(KeyInput, function () {
    return {
      input: inputSubject,
    };
  });
  return {
    KeyInstaller,
    input: inputSubject,
  };
}
