import styled from '@emotion/styled';
import { UnreachableError } from 'base/errors';
import { npx } from 'base/metrics';
import {
  Children,
  type ComponentType,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type Input,
  InputAction,
} from 'ui/input';
import { type ScreenProps } from 'ui/screen/screen';

import { VerticalScrollbar } from './scrollbar';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: stretch;
  min-height: 0;
`;

const ScrollbarContainer = styled.div`
  flex: 0;
  min-width: calc(2 * ${npx});
  margin-left: ${npx};
`;

const Title = styled.div`
  flex: 0;
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

export type MenuProps = PropsWithChildren<{
  TitleText: ComponentType<PropsWithChildren>,
  title?: string,
}> & ScreenProps;

export function Menu({
  TitleText,
  title,
  children,
  input,
}: MenuProps) {
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

  const focusPrevious = useCallback(function () {
    const focused = scroller.current?.querySelector(':focus') as HTMLElement | undefined;
    const target = focused == null
      ? scroller.current?.firstElementChild?.lastElementChild
      : focused.parentElement?.previousElementSibling?.firstChild;
    (target as HTMLElement | undefined)?.focus();
  }, []);

  const focusNext = useCallback(function () {
    const focused = scroller.current?.querySelector(':focus') as HTMLElement | undefined;
    const target = focused == null
      ? scroller.current?.firstElementChild?.firstElementChild
      : focused.parentElement?.nextElementSibling?.firstElementChild;
    (target as HTMLElement | undefined)?.focus();
    console.log(target);
  }, []);

  const selectCurrent = useCallback(function () {
    const target = scroller.current?.firstElementChild?.firstElementChild as HTMLElement | undefined;
    target?.click();
  }, []);

  const keyEventOnCurrent = useCallback(function ({
    down, source,
  }: Input) {
    const focused = scroller.current?.querySelector(':focus') as HTMLElement | undefined;
    const target = focused == null
      ? scroller.current?.firstElementChild?.firstElementChild
      : focused.parentElement?.nextElementSibling?.firstElementChild;
    const event = new KeyboardEvent(
      down ? 'keydown' : 'keyup',
      {
        key: source,
      },
    );
    console.log('firing', event);
    (target as HTMLElement | undefined)?.dispatchEvent(event);

  }, []);

  useEffect(function () {
    if (input == null) {
      return;
    }
    const subscription = input.subscribe(function (input) {
      const {
        action,
        down,
      } = input;
      console.log('menu action', action);
      switch (action) {
        case InputAction.Up:
          if (down) {
            focusPrevious();
          }
          break;
        case InputAction.Down:
          if (down) {
            focusNext();
          }
          break;
        case InputAction.Left:
        case InputAction.Right:
        case InputAction.Select:
          break;
        default:
          throw new UnreachableError(action);
      }
    });
    return subscription.unsubscribe.bind(subscription);
  }, [
    input,
    focusPrevious,
    focusNext,
    keyEventOnCurrent,
  ]);

  useEffect(function () {
    // TODO return to previously focused index
    const target = scroller.current?.firstElementChild?.firstElementChild as HTMLElement | undefined;
    target?.focus();
  }, [children]);

  const onFocus = useCallback(function () {
    if (scroller.current == null) {
      return;
    }
    const {
      scrollHeight,
    } = scroller.current;
    const focused = scroller.current.querySelector(':focus') as HTMLElement | undefined;
    const listItem = focused?.parentElement;
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

  }, []);

  useEffect(onFocus, [onFocus]);

  return (
    <Container>
      {title && <Title>
        <TitleText>
          {title}
        </TitleText>
      </Title>}
      <ScrollContainer>
        <UnorderedList
          ref={scroller}
          onFocus={onFocus}
          onBlur={onFocus}
        >
          {Children.map(children, function (child) {
            return (
              <Item>
                {child}
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
      </ScrollContainer>
    </Container>
  );
}
