import { createPartialObserverComponent } from 'base/react/partial';
import { type ComponentType } from 'react';

import { type ButtonProps } from '../button/types';
import { type Text } from '../typography/types';
import { TextMenuScreenImpl } from './text_menu_screen';
import {
  type TextMenuItem,
  type TextMenuScreen,
} from './types';

export function install({
  Button,
  TitleText,
  FooterText,
}: {
  Button: ComponentType<ButtonProps>,
  TitleText: Text,
  FooterText: Text,
}): {
    TextMenu: TextMenuScreen,
} {
  const TextMenuItemImpl = createPartialObserverComponent(Button, function () {
    return {
      stretch: true,
    };
  });

  const CurriedTextMenu: TextMenuScreen = createPartialObserverComponent(
    TextMenuScreenImpl,
    function () {
      return {
        MenuItem: TextMenuItemImpl,
        keyFactory: function ({ label }: TextMenuItem) {
          return label;
        },
        FooterText,
        TitleText,
      };
    },
  );

  return {
    TextMenu: CurriedTextMenu,
  };
}
