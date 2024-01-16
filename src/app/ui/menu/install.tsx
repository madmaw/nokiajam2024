import { createPartialObserverComponent } from 'base/react/partial';
import { type ComponentType } from 'react';
import { StatefulMenu } from 'ui/menu/stateful';

import { type ButtonProps } from '../button/types';
import {
  type TextMenu as OutputTextMenu,
  type TextMenuItem,
} from './types';

export const StatefulTextMenu = StatefulMenu<TextMenuItem>;

export function install({
  Button,
}: {
  Button: ComponentType<ButtonProps>,
}): {
  TextMenu: OutputTextMenu,
} {
  const TextMenuItemImpl = createPartialObserverComponent(Button, function () {
    return {
      stretch: true,
    };
  });

  const CurriedTextMenu = createPartialObserverComponent(StatefulTextMenu, function () {
    return {
      MenuItem: TextMenuItemImpl,
      keyFactory: function ({ label }: TextMenuItem) {
        return label;
      },
    };
  });

  return {
    TextMenu: CurriedTextMenu,
  };
}
