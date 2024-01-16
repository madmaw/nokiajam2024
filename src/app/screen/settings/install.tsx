import {
  type TextMenu,
  type TextMenuItem,
} from 'app/ui/menu/types';
import { createPartialObserverComponent } from 'base/react/partial';
import {
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import { type MaybeWithInput } from 'ui/input';
import { MasterDetail } from 'ui/master_detail';

const items: TextMenuItem[] = [
  {
    label: 'Theme',
  },
  {
    label: 'Back',
  },
];

export function install({
  TitleText,
  TextMenu,
}: {
  TitleText: ComponentType<PropsWithChildren>,
  TextMenu: TextMenu
}) {
  function activateItem(item: TextMenuItem, index: number) {
    console.log(item, index);
  }

  const Heading = createPartialObserverComponent(TitleText, function () {
    return {
      children: 'Settings',
    };
  });

  function SettingsScreen({
    input,
    output,
  }: MaybeWithInput) {
    return (
      <MasterDetail
        Heading={Heading}
      >
        <TextMenu
          input={input}
          output={output}
          items={items}
          activateItem={activateItem}
        />
      </MasterDetail>
    );
  }

  return {
    SettingsScreen,
  };
}
