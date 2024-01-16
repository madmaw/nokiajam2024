import {
  type TextMenu,
  type TextMenuItem,
} from 'app/ui/menu/types';
import { createPartialObserverComponent } from 'base/react/partial';
import {
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import { MasterDetail } from 'ui/master_detail';
import { type ScreenProps } from 'ui/screen/screen';

const items: TextMenuItem[] = [
  {
    label: 'New Game',
  },
  {
    label: 'Continue',
  },
  {
    label: 'Settings',
  },
  {
    label: 'Exit',
  },
];

export function install({
  TitleText,
  TextMenu,
}: {
  TitleText: ComponentType<PropsWithChildren>,
  TextMenu: TextMenu,
}) {
  function activateItem(item: TextMenuItem, index: number) {
    console.log(item, index);
  }

  const Heading = createPartialObserverComponent(TitleText, function () {
    return {
      children: 'Home',
    };
  });

  function Home({
    input,
  }: ScreenProps) {
    return (
      <MasterDetail
        Heading={Heading}
      >
        <TextMenu
          input={input}
          items={items}
          activateItem={activateItem}
        />
      </MasterDetail>
    );
  }

  return {
    Home,
  };
}
