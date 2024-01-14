import styled from '@emotion/styled';
import {
  fill,
  transparency,
} from 'base/colors';
import { npx } from 'base/metrics';
import {
  type PropsWithChildren,
  useMemo,
} from 'react';

export type ButtonProps = {
  readonly label: string,
  readonly Text: React.ComponentType<PropsWithChildren>,
  readonly stretch?: boolean,
  readonly onClick?: () => void,
};

const inset = 1;

export function Button({
  label,
  Text,
  stretch,
  onClick,
}: ButtonProps) {

  const UnstyledButton = useMemo(function () {
    return styled.button`
      background-color: transparent;
      border: none;
      outline: none;
      margin: 0;
      padding: ${npx} 0 ${npx} calc(${inset} * ${npx});
      overflow: hidden;
      text-size-adjust: none;
      width: ${stretch ? '100%' : 'auto'};
      text-align: start;
      &:focus {
        background-color: ${fill.toString({ format: 'hex' })};
        color: ${transparency.toString({ format: 'hex' })};
      }
      &:active > * {
        transform: translateY(${npx});
      }
    `;
  }, [stretch]);

  return (
    <UnstyledButton onClick={onClick}>
      <Text>
        {label}
      </Text>
    </UnstyledButton>
  );
}
