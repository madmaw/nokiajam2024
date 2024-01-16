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
  InputAction,
  InputProgress,
  type MaybeWithInput,
} from 'ui/input';

import { VerticalScrollbar } from './scrollbar';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: stretch;
  min-height: 0;
  height: 100%;
`;

const ScrollbarContainer = styled.div`
  flex: 0;
  min-width: calc(2 * ${npx});
  margin-left: ${npx};
`;

const UnorderedList = styled.ul`
  position: relative;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  margin-block-start: 0;
  padding-inline-start: 0;
  margin-block-end: 0;
  padding-inline-end: 0;
`;

const Item = styled.li`
  list-style-type: none;
`;

export type MenuProps<T> = MaybeWithInput<{
  readonly items: readonly T[],
  readonly MenuItem: ComponentType<MaybeWithInput<{
    readonly selected: boolean,
    readonly onClick: () => void,
  } & T>>,
  readonly keyFactory: (item: T) => Key,
  readonly selectedItemIndex: number | undefined,
  readonly selectItemIndex: (index: number) => void,
  readonly activateItem: (item: T, index: number) => void,
}>;

export function Menu<T>({
  input,
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
      scrollOffset,
      containerDimension,
      contentDimension,
    },
    setScrollState,
  ] = useState({
    scrollOffset: 0,
    containerDimension: 0,
    contentDimension: 0,
  });

  const selectPrevious = useCallback(function () {
    selectItemIndex(Math.max(0, (selectedItemIndex ?? 0) - 1));
  }, [
    selectItemIndex,
    selectedItemIndex,
  ]);

  const selectNext = useCallback(function () {
    selectItemIndex(Math.min(items.length - 1, (selectedItemIndex ?? items.length) + 1));
  }, [
    selectItemIndex,
    selectedItemIndex,
    items,
  ]);

  useEffect(function () {
    if (input == null) {
      return;
    }
    const subscription = input.subscribe(function (input) {
      const {
        action,
        progress,
      } = input;
      if (progress === InputProgress.Commit) {
        switch (action) {
          case InputAction.Up:
            selectPrevious();
            break;
          case InputAction.Down:
            selectNext();
            break;
          default:
            break;
        }
      }
    });
    return subscription.unsubscribe.bind(subscription);
  }, [
    input,
    selectPrevious,
    selectNext,
  ]);

  const computeScrollState = useCallback(function () {
    if (scroller.current == null) {
      return;
    }
    const {
      scrollHeight,
    } = scroller.current;
    const listItem = selectedItemIndex != null
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      ? (scroller.current.children.item(selectedItemIndex) as HTMLElement | undefined)
      : undefined;
    if (listItem != null) {
      setScrollState({
        scrollOffset: listItem.offsetTop,
        containerDimension: listItem.clientHeight,
        contentDimension: scrollHeight,
      });
      return;
    }
    setScrollState({
      scrollOffset: 0,
      containerDimension: 0,
      contentDimension: scrollHeight,
    });

  }, [selectedItemIndex]);

  useEffect(computeScrollState, [computeScrollState]);

  return (
    <Container>
      <UnorderedList
        ref={scroller}
      >
        {items.map(function (item, index) {
          const selected = selectedItemIndex === index;
          return (
            <Item key={keyFactory(item)}>
              <MenuItem
                input={selected ? input : undefined}
                selected={selected}
                // TODO useCallback
                onSelected={() => {
                  selectItemIndex(index);
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
      <ScrollbarContainer>
        <VerticalScrollbar
          containerDimension={containerDimension}
          contentDimension={contentDimension}
          scrollOffset={scrollOffset}
        />
      </ScrollbarContainer>
    </Container>
  );
}
