import styled from '@emotion/styled';
import { npx } from 'base/metrics';
import {
  type ComponentType,
  type Key,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type Input,
  InputAction,
  InputProgress,
  type MaybeWithInput,
  useOutput,
} from 'ui/input';

import { VerticalScrollbar } from './scrollbar';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: stretch;
  min-height: 0;
  height: 100%;
  overflow: hidden;
`;

const ScrollbarContainer = styled.div`
  flex: 0;
  min-width: calc(3 * ${npx});
  margin-left: ${npx};
`;

const UnorderedList = styled.ul`
  position: relative;
  flex: 1;
  overflow: hidden;
  scroll-behavior: auto;
  min-height: 0;
  margin-block-start: 0;
  padding-inline-start: 0;
  margin-block-end: 0;
  padding-inline-end: 0;
`;

const Item = styled.li`
  list-style-type: none;
`;

export type MenuItemProps<T> = MaybeWithInput<{
  readonly selected: boolean,
  readonly onClick: () => void,
} & T>;

export type MenuProps<T> = MaybeWithInput<{
  readonly items: readonly T[],
  readonly MenuItem: ComponentType<MenuItemProps<T>>,
  readonly keyFactory: (item: T) => Key,
  readonly selectedItemIndex: number | undefined,
  readonly selectItemIndex?: (index: number) => void,
  readonly activateItem: (item: T, index: number) => void,
}>;

export function Menu<T>({
  input,
  output,
  MenuItem,
  items,
  keyFactory,
  selectedItemIndex,
  selectItemIndex,
  activateItem,
}: MenuProps<T>) {
  const scroller = useRef<HTMLUListElement>(null);
  const [
    {
      itemOffset,
      itemDimension,
      containerDimension,
      contentDimension,
    },
    setScrollState,
  ] = useState({
    itemOffset: 0,
    itemDimension: 0,
    containerDimension: 0,
    contentDimension: 0,
  });
  const [
    marginTop,
    setMarginTop,
  ] = useState(0);

  const selectPrevious = useCallback(function () {
    selectItemIndex?.(Math.max(0, (selectedItemIndex ?? 0) - 1));
  }, [
    selectItemIndex,
    selectedItemIndex,
  ]);

  const selectNext = useCallback(function () {
    selectItemIndex?.(Math.min(items.length - 1, (selectedItemIndex ?? items.length) + 1));
  }, [
    selectItemIndex,
    selectedItemIndex,
    items,
  ]);

  const childOutputHandler = useCallback(function (input: Input) {
    const {
      action,
      progress,
    } = input;
    if (progress === InputProgress.Commit) {
      switch (action) {
        case InputAction.Up:
          selectPrevious();
          return true;
        case InputAction.Down:
          selectNext();
          return true;
        default:
          return;
      }
    }
  }, [
    selectNext,
    selectPrevious,
  ]);

  const childOutput = useOutput(
    output,
    childOutputHandler,
  );

  const computeScrollState = useCallback(function () {
    if (scroller.current == null) {
      return;
    }
    const {
      scrollHeight,
      clientHeight,
    } = scroller.current;
    const listItem = selectedItemIndex != null
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      ? (scroller.current.children.item(selectedItemIndex) as HTMLElement | undefined)
      : undefined;
    if (listItem != null) {
      setScrollState({
        itemOffset: listItem.offsetTop,
        itemDimension: listItem.clientHeight,
        containerDimension: clientHeight + marginTop,
        contentDimension: scrollHeight,
      });
      return;
    }
    setScrollState({
      itemOffset: 0,
      itemDimension: 0,
      containerDimension: clientHeight - marginTop,
      contentDimension: scrollHeight,
    });

  }, [
    selectedItemIndex,
    marginTop,
  ]);

  useEffect(computeScrollState, [computeScrollState]);
  useEffect(function () {
    if (scroller.current == null) {
      return;
    }
    const {
      clientHeight,
    } = scroller.current;
    const actualClientHeight = clientHeight + marginTop;
    const newMarginTop = Math.min(
      // can't scroll past the top
      0,
      // preference existing scroll window
      Math.max(-itemOffset, marginTop),
      // scroll beyond the end of the scroll window
      actualClientHeight - itemOffset - itemDimension,
    );
    setMarginTop(newMarginTop);
    //console.log(scrollHeight, itemOffset, itemDimension, marginTop, newMarginTop);
  }, [
    marginTop,
    itemDimension,
    itemOffset,
  ]);

  return (
    <Container>
      <UnorderedList
        ref={scroller}
        style={{
          marginTop: `${marginTop}px`,
        }}
      >
        {items.map(function (item, index) {
          const selected = selectedItemIndex === index;
          return (
            <Item key={keyFactory(item)}>
              <MenuItem
                input={selected ? input : undefined}
                output={childOutput}
                selected={selected}
                // TODO useCallback
                onSelected={() => {
                  selectItemIndex?.(index);
                }}
                onClick={() => {
                  activateItem(item, index);
                }}
                {...item}
              />
            </Item>
          );
        })}
      </UnorderedList>
      {containerDimension < contentDimension && (
        <ScrollbarContainer>
          <VerticalScrollbar
            itemOffset={itemOffset}
            itemDimension={itemDimension}
            containerDimension={containerDimension}
            contentDimension={contentDimension}
          />
        </ScrollbarContainer>
      )}
    </Container>
  );
}
