import styled from '@emotion/styled';
import {
  npx,
  pxPerNpx,
} from 'base/metrics';
import {
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

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
  pad: boolean,
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
  margin-right: ${({ pad }) => pad ? npx : 0 };
`;

export function Text({
  children,
  fontFamily,
  unscaledFontSize,
  unscaledLineHeight,
  alignment = TextAlignment.Start,
}: TextProps) {
  const [
    ref,
    setRef,
  ] = useState<HTMLDivElement | null>(null);

  const pad = useMemo(function () {
    const textContent = ref?.textContent;
    if (textContent == null || alignment !== TextAlignment.Center) {
      return false;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return false;
    }
    ctx.font = `${unscaledFontSize * pxPerNpx}px ${fontFamily}`;
    const { width } = ctx.measureText(textContent);
    return Math.round(width / pxPerNpx) % 2 !== 0;
  }, [
    ref,
    alignment,
    fontFamily,
    unscaledFontSize,
  ]);

  return (
    <Container
      ref={setRef}
      fontFamily={fontFamily}
      unscaledFontSize={unscaledFontSize}
      unscaledLineHeight={unscaledLineHeight}
      alignment={alignment}
      pad={pad}
    >
      {children}
    </Container>
  );
}
