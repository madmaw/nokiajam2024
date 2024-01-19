import { type ComponentType } from 'react';
import { type MenuProps } from 'ui/menu/menu';

export type TextMenuItem = { readonly label: string };
export type TextMenuScreenProps = Pick<MenuProps<TextMenuItem>, 'input' | 'output' | 'items' | 'activateItem'> & {
  initialSelectedItemIndex?: number,
  selectItemIndex?: (index: number) => void,
  requestBack?: () => void,
  title: string,
  Footer: ComponentType<{
    selectedItem: TextMenuItem,
  }>,

};
export type TextMenuScreen = ComponentType<TextMenuScreenProps>;
