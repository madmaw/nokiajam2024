import { type ComponentType } from 'react';
import { type MenuItemProps } from 'ui/menu/menu';

import { type ButtonProps } from '../button/types';
import { type Icon } from '../icon/types';
import { type TextMenuItem } from './types';

export type TextMenuItemProps = MenuItemProps<TextMenuItem> & {
  readonly Button: ComponentType<ButtonProps>,
  readonly CheckIcon: Icon,
};

export function TextMenuItemComponent({
  checked,
  CheckIcon,
  Button,
  ...props
}: TextMenuItemProps) {
  return (
    <Button
      {...props}
      Icon={checked ? CheckIcon : undefined}
    />
  );
}
