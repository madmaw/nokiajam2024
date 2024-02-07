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
  type Input,
  InputAction,
  InputProgress,
  type MaybeWithInput,
  useInput,
} from './input';

export type ButtonProps = MaybeWithInput<{
  readonly label?: string,
  readonly Icon?: React.ComponentType<{ invert?: boolean }>,
  readonly Text: React.ComponentType<PropsWithChildren>,
  readonly stretch?: boolean,
  readonly onClick?: () => void,
  readonly selected?: boolean,
  readonly onSelected?: () => void,
}>;

const inset = 2;

const UnstyledButton = styled.button<{
  active: boolean,
  selected: boolean,
  stretch: boolean,
}>`
  label: button-unstyled;
  display: flex;
  flex-direction: row;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-size-adjust: none;
  text-align: start;
  background-color: ${({ selected }) => selected ? fill.toString({ format: 'hex' }) : 'transparent'};
  color: ${({ selected }) => selected ? transparency.toString({ format: 'hex' }) : 'inherit'};
  width: ${({ stretch }) => stretch ? '100%' : 'auto'};
  > * {
    transform: ${({ active }) => active ? `translateY(${npx})` : 'none'};
  }
`;

const TextContainer = styled.div`
  label: button-text;
  flex: 1;
  padding: ${npx} 0 ${npx} calc(${inset} * ${npx});
`;
const IconContainer = styled.div`
  label: button-icon;
  flex: 0;
  padding-right: ${npx};
  padding-top: ${npx};
`;

export function Button({
  label,
  Icon,
  Text,
  stretch = false,
  input,
  output,
  onClick,
  selected = false,
  onSelected,
}: ButtonProps) {

  const [
    active,
    setActive,
  ] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const inputHandler = useCallback(function ({
    action, progress,
  }: Input) {
    switch (action) {
      case InputAction.Select:
        setActive(progress === InputProgress.Start);
        if (progress === InputProgress.Commit) {
          buttonRef.current?.click();
          return true;
        }
        return;
      default:
        return;
    }
  }, []);

  useInput(input, output, inputHandler);

  const maybeOnSelected = useCallback(function () {
    if (onSelected && !selected) {
      onSelected();
    }
  }, [
    selected,
    onSelected,
  ]);

  const focus = useCallback(function () {
    //buttonRef.current?.focus();
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
      tabIndex={-1}
    >
      {label && (
        <TextContainer>
          <Text>
            {label}
          </Text>
        </TextContainer>
      )}
      {Icon && (
        <IconContainer>
          <Icon invert={selected}/>
        </IconContainer>
      )}
    </UnstyledButton>
  );
}
