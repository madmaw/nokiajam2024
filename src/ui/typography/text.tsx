import styled from '@emotion/styled';
import { npx } from 'base/metrics';
import { type PropsWithChildren } from 'react';

export const enum TextAlignment {
  Start = 'start',
  Center = 'center',
  End = 'end',
}

export type TextProps = PropsWithChildren<{
  readonly fontFamily: string,
  readonly unscaledFontSize: number,
  readonly unscaledLineHeight: number,
  readonly alignment?: TextAlignment,
}>;

const Container = styled.div<{
  fontFamily: string,
  unscaledFontSize: number,
  unscaledLineHeight: number,
  alignment: TextAlignment,
}>`
  overflow: hidden;
  font-family: ${({ fontFamily }) => fontFamily};
  font-size: ${({ unscaledFontSize }) => `calc(${unscaledFontSize} * ${npx})` };
  text-size-adjust: none;
  line-height: ${({ unscaledLineHeight }) => `calc(${unscaledLineHeight} * ${npx})` };
  text-align: ${({ alignment }) => alignment };
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
  alignment = TextAlignment.Start,
}: TextProps) {
  return (
    <Container
      fontFamily={fontFamily}
      unscaledFontSize={unscaledFontSize}
      unscaledLineHeight={unscaledLineHeight}
      alignment={alignment}
    >
      {children}
    </Container>
  );
}
