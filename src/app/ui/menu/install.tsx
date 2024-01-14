import { createPartialObserverComponent } from 'base/react/partial';
import {
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import { Menu } from 'ui/menu/menu';

export function install({
  TitleText,
  Button,
}: {
  TitleText: ComponentType<PropsWithChildren>,
  Button: ComponentType<{ label: string, stretch?: boolean }>,
}) {
  const MenuWithText = createPartialObserverComponent(Menu, function () {
    return {
      TitleText,
    };
  });
  const MenuItem = createPartialObserverComponent(Button, function () {
    return {
      stretch: true,
    };
  });

  return {
    Menu: MenuWithText,
    MenuItem,
  };
}
