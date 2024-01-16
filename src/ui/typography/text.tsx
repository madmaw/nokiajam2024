import styled from '@emotion/styled';
import { npx } from 'base/metrics';
import { type PropsWithChildren } from 'react';

export type TextProps = PropsWithChildren<{
  readonly fontFamily: string,
  readonly unscaledFontSize: number,
  readonly unscaledLineHeight: number,
}>;

const Container = styled.div<{
  fontFamily: string,
  unscaledFontSize: number,
  unscaledLineHeight: number,
}>`
  overflow: hidden;
  font-family: ${({ fontFamily }) => fontFamily};
  font-size: ${({ unscaledFontSize }) => `calc(${unscaledFontSize} * ${npx})` };
  text-size-adjust: none;
  line-height: ${({ unscaledLineHeight }) => `calc(${unscaledLineHeight} * ${npx})` };
  // inset so the excess line height gets removed around the top and bottom
  margin: ${({
    unscaledLineHeight,
    unscaledFontSize,
  }) => `calc(${(unscaledFontSize - unscaledLineHeight)/2} * ${npx}) 0`};
`;

export function Text({
  children,
  fontFamily,
  unscaledFontSize,
  unscaledLineHeight,
}: TextProps) {
  return (
    <Container
      fontFamily={fontFamily}
      unscaledFontSize={unscaledFontSize}
      unscaledLineHeight={unscaledLineHeight}
    >
      {children}
    </Container>
  );
}
