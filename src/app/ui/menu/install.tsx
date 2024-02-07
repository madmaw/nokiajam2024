import { createPartialComponent } from 'base/react/partial';
import { type ComponentType } from 'react';

import { type ButtonProps } from '../button/types';
import { type Text } from '../typography/types';
import { TextMenuItemComponent } from './text_menu_item';
import { TextMenuScreenImpl } from './text_menu_screen';
import {
  type TextMenuItem,
  type TextMenuScreen,
} from './types';

export function install({
  Button,
  TitleText,
  FooterText,
  CheckIcon,
}: {
  Button: ComponentType<ButtonProps>,
  TitleText: Text,
  FooterText: Text,
    CheckIcon: ComponentType,
}): {
    TextMenu: TextMenuScreen,
} {
  const TextMenuItemImpl = createPartialComponent(TextMenuItemComponent, {
    stretch: true,
    Button,
    CheckIcon,
  });

  const CurriedTextMenu: TextMenuScreen = createPartialComponent(
    TextMenuScreenImpl,
    {
      MenuItem: TextMenuItemImpl,
      keyFactory: function ({ label }: TextMenuItem) {
        return label;
      },
      FooterText,
      TitleText,
    },
  );

  return {
    TextMenu: CurriedTextMenu,
  };
}
