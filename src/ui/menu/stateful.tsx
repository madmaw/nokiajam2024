import {
  useCallback,
  useState,
} from 'react';

import {
  Menu,
  type MenuProps,
} from './menu';

// manage selected item index internally
export type StatefulMenuProps<T> = Omit<MenuProps<T>, 'selectedItemIndex' | 'selectItemIndex'>;

export function StatefulMenu<T>(props: StatefulMenuProps<T>) {
  const [
    selectedItemIndex,
    setSelectedItemIndex,
  ] = useState<number | undefined>(0);

  const selectItemIndex = useCallback(function (index: number) {
    setSelectedItemIndex(index);
  }, []);

  return (
    <Menu
      selectedItemIndex={selectedItemIndex}
      selectItemIndex={selectItemIndex}
      {...props}
    />
  );
}
