import styled from '@emotion/styled';
import { pxPerNpx } from 'base/metrics';
import {
  type ComponentType,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { MasterDetail } from 'ui/master_detail';
import {
  Menu,
  type MenuProps,
} from 'ui/menu/menu';
import { TextAlignment } from 'ui/typography/text';

import { type Text } from '../typography/types';
import { type TextMenuItem } from './types';

const back: TextMenuItem = {
  label: 'Back',
};

export const TextMenu = Menu<TextMenuItem>;

export const FooterContainer = styled.div`
  padding-top: ${pxPerNpx};
`;

export function TextMenuScreenImpl(
    props: Omit<MenuProps<TextMenuItem>, 'selectedItemIndex'> & {
    requestBack?: () => void,
    initialSelectedItemIndex?: number,
    title: string,
    TitleText: Text,
    Footer: ComponentType<{
      selectedItem: TextMenuItem,
    }>,
    FooterText: Text,
  },
) {
  const {
    TitleText,
    title,
    items,
    activateItem,
    requestBack,
    FooterText,
    Footer,
    selectItemIndex,
    initialSelectedItemIndex,
  } = props;
  const itemsWithBackOption = useMemo(function () {
    return requestBack ? [
      ...items,
      back,
    ] : items;
  }, [
    items,
    requestBack,
  ]);
  const Heading = useCallback(function () {
    return (
      <TitleText alignment={TextAlignment.End}>
        {title}
      </TitleText>
    );
  }, [
    TitleText,
    title,
  ]);

  const [
    selectedItemIndex,
    setSelectedItemIndex,
  ] = useState<number>(initialSelectedItemIndex ?? 0);

  const statefulSelectItemIndex = useCallback(function (index: number) {
    setSelectedItemIndex(index);
    selectItemIndex?.(index);
  }, [selectItemIndex]);

  const selectedItem = useMemo(function () {
    return itemsWithBackOption[selectedItemIndex];
  }, [
    selectedItemIndex,
    itemsWithBackOption,
  ]);

  const SelectedFooter = useCallback(function () {
    return (
      <FooterContainer>
        <FooterText alignment={TextAlignment.Center}>
          {
            selectedItem === back
              ? 'Back'
              : (
                <Footer
                  selectedItem={selectedItem}
                />
              )
          }
        </FooterText>
      </FooterContainer>
    );
  }, [
    Footer,
    FooterText,
    selectedItem,
  ]);

  const activateItemWithBack = useCallback(function (item: TextMenuItem, index: number) {
    if (item === back) {
      requestBack?.();
    } else {
      activateItem(item, index);
    }
  }, [
    activateItem,
    requestBack,
  ]);
  return (
    <MasterDetail
      Heading={Heading}
      Footer={SelectedFooter}
    >
      <TextMenu
        {...props}
        selectItemIndex={statefulSelectItemIndex}
        selectedItemIndex={selectedItemIndex}
        items={itemsWithBackOption}
        activateItem={activateItemWithBack}
      />
    </MasterDetail>
  );
}
