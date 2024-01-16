import { createPartialObserverComponent } from 'base/react/partial';
import {
  type Observable,
  Subject,
} from 'rxjs';
import { type Input } from 'ui/input';

import { WindowInput } from './window_input';

export function install(): {
  InputInstaller: React.ComponentType,
  input: Observable<Input>,
  } {
  const inputSubject = new Subject<Input>();
  const InputInstaller = createPartialObserverComponent(WindowInput, function () {
    return {
      input: inputSubject,
    };
  });
  return {
    InputInstaller,
    input: inputSubject,
  };
}
