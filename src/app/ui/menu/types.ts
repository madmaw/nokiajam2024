import { type ComponentType } from 'react';
import { type MenuProps } from 'ui/menu/menu';

export type TextMenuItem = { readonly label: string };
export type TextMenuProps = Pick<MenuProps<TextMenuItem>, 'input' | 'items' | 'activateItem'>;
export type TextMenu = ComponentType<TextMenuProps>;
