import styled from '@emotion/styled';
import { npx } from 'base/metrics';
import {
  type PropsWithChildren,
  useMemo,
} from 'react';

export type TextProps = PropsWithChildren<{
  readonly fontFamily: string,
  readonly unscaledFontSize: number,
  readonly unscaledLineHeight: number,
}>;

export function Text({
  children,
  fontFamily,
  unscaledFontSize,
  unscaledLineHeight,
}: TextProps) {
  const Container = useMemo(function () {
    const linePadding = (unscaledLineHeight - unscaledFontSize)/2;
    // negative margin doesn't work if we use span, which would be more correct
    return styled.div`
      overflow: hidden;
      font-family: ${fontFamily};
      font-size: calc(${unscaledFontSize} * ${npx});
      text-size-adjust: none;
      line-height: calc(${unscaledLineHeight} * ${npx});
      // inset so the excess line height gets removed around the top and bottom
      margin: calc(${-linePadding} * ${npx}) 0;
    `;
  }, [
    fontFamily,
    unscaledFontSize,
    unscaledLineHeight,
  ]);

  return (
    <Container>
      {children}
    </Container>
  );
}
