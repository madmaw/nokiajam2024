import { createPartialObserverComponent } from 'base/react/partial';
import {
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import { Button } from 'ui/button';

import { type ButtonProps } from './types';

export function install({ Text }: { Text: ComponentType<PropsWithChildren> }): {
  Button: ComponentType<ButtonProps>,
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
