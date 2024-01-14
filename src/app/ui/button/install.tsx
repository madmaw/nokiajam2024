import { createPartialObserverComponent } from 'base/react/partial';
import {
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import {
  Button,
  type ButtonProps,
} from 'ui/button';

export function install({ Text }: { Text: ComponentType<PropsWithChildren> }): {
  Button: ComponentType<Omit<ButtonProps, 'Text'>>,
} {
  const ButtonWithText = createPartialObserverComponent(
    Button,
    function() {
      return { Text };
    },
  );

  return {
    Button: ButtonWithText,
  };
}
