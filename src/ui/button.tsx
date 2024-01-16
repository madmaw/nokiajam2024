import styled from '@emotion/styled';
import {
  fill,
  transparency,
} from 'base/colors';
import { npx } from 'base/metrics';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  InputAction,
  InputProgress,
  type MaybeWithInput,
} from './input';

export type ButtonProps = MaybeWithInput<{
  readonly label: string,
  readonly Text: React.ComponentType<PropsWithChildren>,
  readonly stretch?: boolean,
  readonly onClick?: () => void,
  readonly selected?: boolean,
  readonly onSelected?: () => void,
}>;

const inset = 1;

const UnstyledButton = styled.button<{
  active: boolean,
  selected: boolean,
  stretch: boolean,
}>`
  border: none;
  outline: none;
  margin: 0;
  padding: ${npx} 0 ${npx} calc(${inset} * ${npx});
  overflow: hidden;
  text-size-adjust: none;
  text-align: start;
    > * {
      transform: ${({ active }) => active ? `translateY(${npx})` : 'none'};
    }
    background-color: ${({ selected }) => selected ? fill.toString({ format: 'hex' }) : 'transparent'};
    color: ${({ selected }) => selected ? transparency.toString({ format: 'hex' }) : 'inherit'};
    width: ${({ stretch }) => stretch ? '100%' : 'auto'};
`;

export function Button({
  label,
  Text,
  stretch = false,
  input,
  onClick,
  selected = false,
  onSelected,
}: ButtonProps) {

  const [
    active,
    setActive,
  ] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(function () {
    if (input == null) {
      return;
    }
    const subscription = input.subscribe(function ({
      action,
      progress,
    }) {
      switch (action) {
        case InputAction.Select:
          setActive(progress === InputProgress.Start);
          if (progress === InputProgress.Commit) {
            buttonRef.current?.click();
          }
          break;
        default:
          break;
      }
    });
    return subscription.unsubscribe.bind(subscription);
  }, [input]);

  const maybeOnSelected = useCallback(function () {
    if (onSelected && !selected) {
      onSelected();
    }
  }, [
    selected,
    onSelected,
  ]);

  const focus = useCallback(function () {
    buttonRef.current?.focus();
  }, []);

  useEffect(function () {
    if (selected) {
      focus();
    }
    // want the button ref to be populated before focusing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    buttonRef.current,
    selected,
    focus,
  ]);

  const onMouseDown = useCallback(function () {
    setActive(true);
    focus();
  }, [
    setActive,
    focus,
  ]);

  const onMouseUp = useCallback(function () {
    setActive(false);
  }, [setActive]);

  return (
    <UnstyledButton
      ref={buttonRef}
      onClick={onClick}
      onFocus={maybeOnSelected}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      active={active}
      selected={selected}
      stretch={stretch}
    >
      <Text>
        {label}
      </Text>
    </UnstyledButton>
  );
}
