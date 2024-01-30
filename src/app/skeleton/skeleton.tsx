import styled from '@emotion/styled';
import { type ReadonlyColor } from 'base/color';
import { transparency } from 'base/colors';
import {
  npx,
  pixelAspectRatio,
  pxPerNpx,
  screenHeight,
  screenWidth,
} from 'base/metrics';
import type Color from 'colorjs.io';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

//const scanlineThickness = `calc(${npx} * .1)`;
const scanlineHorizontalBreakpoint = '700px';
const scanlineVerticalBreakpoint = '400px';
const widthCalc = `(${screenWidth * pixelAspectRatio} * ${npx})`;
const heightCalc = `(${screenHeight} * ${npx})`;
const filterName = 'skeleton-filter';
const opaqueColor = '#000';

const bigScreenMediaQuery = `@media screen and (min-width: ${scanlineHorizontalBreakpoint}) and (min-height: ${scanlineVerticalBreakpoint})`;

const Content = styled.div`
  position: absolute;
  width: ${100 / pixelAspectRatio}%;
  height: 100%;
  left: calc((100% - ${100/pixelAspectRatio}%)/2);
  overflow: hidden;
  transform: scaleX(${pixelAspectRatio});
  color: ${opaqueColor};
  label: skeleton-content;
`;

const ScanLines = styled.div<{ scanlineThickness: string }>`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  //opacity: .5;
  label: skeleton-scan-lines;
  ${bigScreenMediaQuery} {
    background:
      repeating-linear-gradient(
        ${transparency.toString({ format: 'hex' })} 0,
        ${transparency.toString({ format: 'hex' })} ${({ scanlineThickness }) => scanlineThickness},
        transparent ${({ scanlineThickness }) => scanlineThickness},
        transparent calc(${npx} - ${({ scanlineThickness }) => scanlineThickness}),
        ${transparency.toString({ format: 'hex' })} calc(${npx} - ${({ scanlineThickness }) => scanlineThickness}),
        ${transparency.toString({ format: 'hex' })} ${npx}
      ),
      repeating-linear-gradient(
        90deg,
        ${transparency.toString({ format: 'hex' })} 0,
        ${transparency.toString({ format: 'hex' })} ${({ scanlineThickness }) => scanlineThickness},
        transparent ${({ scanlineThickness }) => scanlineThickness},
        transparent calc(${npx} * ${pixelAspectRatio} - ${({ scanlineThickness }) => scanlineThickness}),
        ${transparency.toString({ format: 'hex' })} calc(${npx} * ${pixelAspectRatio} - ${({ scanlineThickness }) => scanlineThickness}),
        ${transparency.toString({ format: 'hex' })} calc(${npx} * ${pixelAspectRatio})
      );
  }
`;

const Spacer = styled.div<{ backlit: boolean, scanlineThickness: string }>`
  position: absolute;
  left: calc((100vw - ${widthCalc}) / 2);
  top: calc((100vh - ${heightCalc}) / 2);
  width: calc(${widthCalc});
  height: calc(${heightCalc});
  label: skeleton-spacer;
  filter:
    blur(calc(.2 * ${npx}))
    url(#${filterName})
    ${({ backlit }) => backlit ? `blur(calc(.1 * ${npx}))` : `blur(calc(.05 * ${npx})) drop-shadow(0 calc(${npx}/3) calc(${npx}/2) rgba(0, 0, 0, 0.5))`};
  ${bigScreenMediaQuery} {
    filter:
      blur(calc(${({ scanlineThickness }) => scanlineThickness} * 2))
      url(#${filterName})
      ${({ backlit }) => backlit ? `blur(calc(.1 * ${npx}))` : `blur(calc(.03 * ${npx})) drop-shadow(0 calc(${npx}/3) calc(${npx}/2) rgba(0, 0, 0, 0.5))`};
  }

`;

const Container = styled.div<{ background: Color, scale: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: ${({ scale }) => `scale(${Math.max(1, Math.floor(scale * 2)/2)})`};
  background-color: ${({ background }) => background.toString({ format: 'hex' })};
  label: skeleton-container;
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0, transparent 10vmax, #000000 35vmax);
  pointer-events: none;
  label: skeleton-overlay;
`;

export function Skeleton({
  children,
  foreground,
  background,
  backlit,
}: PropsWithChildren<{
  readonly foreground: ReadonlyColor,
  readonly background: ReadonlyColor,
  readonly backlit: boolean,
}>) {
  const [
    scale,
    setScale,
  ] = useState<number>(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const scanlineThickness = `${pxPerNpx * .1}px`;

  const maybeFirePixelDimensionChange = useCallback(function () {
    if (contentRef.current == null) {
      return;
    }
    const {
      clientWidth,
      clientHeight,
    } = contentRef.current;
    const scale = Math.min(
      (clientWidth * .95) / (pxPerNpx * screenWidth * pixelAspectRatio),
      (clientHeight * .95) / (pxPerNpx * screenHeight),
    );
    setScale(scale);
  }, [setScale]);

  useEffect(function () {
    window.addEventListener('resize', maybeFirePixelDimensionChange);
    maybeFirePixelDimensionChange();
    return function () {
      window.removeEventListener('resize', maybeFirePixelDimensionChange);
    };
  }, [maybeFirePixelDimensionChange]);
  // undo built-in gamma correction in filter?
  const rgb = foreground.srgb.map(v => Math.pow(v, 2.2));
  //const rgb = foreground.srgb;
  const { alpha } = foreground;

  return (
    <>
      <svg
        width={0}
        height={0}
      >
        <defs>
          <filter id={filterName}>
            <feColorMatrix
              type='matrix'
              values={`
                0 0 0 ${rgb[0]} 0
                0 0 0 ${rgb[1]} 0
                0 0 0 ${rgb[2]} 0
               -1 0 0 ${alpha}  0
              `}
            />
          </filter>
        </defs>
      </svg>
      <Container
        ref={contentRef}
        background={background}
        scale={scale}
      >
        <Spacer
          backlit={backlit}
          scanlineThickness={scanlineThickness}
        >
          <Content>
            {children}
          </Content>
          <ScanLines scanlineThickness={scanlineThickness }/>
        </Spacer>
        <Overlay />
      </Container>

    </>
  );
}
