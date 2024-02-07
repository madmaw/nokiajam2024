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
const widthCalc = `(${screenWidth} * ${npx})`;
const heightCalc = `(${screenHeight} * ${npx})`;
const filterName = 'skeleton-filter';
const opaqueColor = '#000';
const transitionDuration = '1s';

const bigScreenMediaQuery = `@media screen and (min-width: ${scanlineHorizontalBreakpoint}) and (min-height: ${scanlineVerticalBreakpoint})`;

const Content = styled.div<{ scaleBy: number }>`
  label: skeleton-content;
  position: absolute;
  left: calc((100vw - ${widthCalc}) / 2);
  top: calc((100vh - ${heightCalc}) / 2);
  width: calc(${widthCalc});
  height: calc(${heightCalc});
  overflow: hidden;
  transform: ${({ scaleBy }) => `scale(${scaleBy})`} scaleX(${pixelAspectRatio});
  transform-origin: center;
  color: ${opaqueColor};
`;

const unscaledScanlineThickness = .4;

const ScanLines = styled.div<{ scaleBy: number }>`
  label: skeleton-scan-lines;
  position: absolute;
  pointer-events: none;
  left: calc((100vw - ${widthCalc} * ${({ scaleBy }) => scaleBy * pixelAspectRatio}) / 2);
  top: calc((100vh - ${heightCalc} * ${({ scaleBy }) => scaleBy}) / 2);
  width: calc(${widthCalc} * ${({ scaleBy }) => scaleBy * pixelAspectRatio});
  height: calc(${heightCalc} * ${({ scaleBy }) => scaleBy});
  ${bigScreenMediaQuery} {
    background:
      // horizontal scan lines (spaced vertically)
      repeating-linear-gradient(
        ${transparency.toString({ format: 'hex' })} 0,
        ${transparency.toString({ format: 'hex' })} ${({ scaleBy }) => `${unscaledScanlineThickness/2 * scaleBy}px`},
        transparent ${({ scaleBy }) => `${unscaledScanlineThickness * scaleBy}px`},
        transparent ${({ scaleBy }) => `${(pxPerNpx - unscaledScanlineThickness) * scaleBy}px`},
        ${transparency.toString({ format: 'hex' })} ${({ scaleBy }) => `${(pxPerNpx - unscaledScanlineThickness/2) * scaleBy}px`},
        ${transparency.toString({ format: 'hex' })} ${({ scaleBy }) => `${pxPerNpx * scaleBy}px`}
      ),
      // vertical scan lines (spaced horizontally)
      repeating-linear-gradient(
        90deg,
        ${transparency.toString({ format: 'hex' })} 0,
        ${transparency.toString({ format: 'hex' })} ${({ scaleBy }) => `${unscaledScanlineThickness/2 * scaleBy}px`},
        transparent ${({ scaleBy }) => `${unscaledScanlineThickness * scaleBy}px`},
        transparent ${({ scaleBy }) => `${(pxPerNpx * pixelAspectRatio - unscaledScanlineThickness) * scaleBy}px`},
        ${transparency.toString({ format: 'hex' })} ${({ scaleBy }) => `${(pxPerNpx * pixelAspectRatio - unscaledScanlineThickness/2) * scaleBy}px`},
        ${transparency.toString({ format: 'hex' })} ${({ scaleBy }) => `${(pxPerNpx * pixelAspectRatio ) * scaleBy}px`}
      );
  }
`;

const FilterContainer = styled.div<{ backlit: boolean, scaleBy: number }>`
  label: skeleton-filter-container;
  position: absolute;
  transition-property: filter;
  transition-duration: ${transitionDuration};
  filter:
    blur(${({ scaleBy }) => `${.5 * scaleBy}px`})
    url(#${filterName})
    ${({
    backlit, scaleBy,
  }) => !backlit && `drop-shadow(0 ${1 * scaleBy}px ${2 * scaleBy}px rgba(20, 0, 10, 0.7))`};
  ${bigScreenMediaQuery} {
    filter:
      blur(${({ scaleBy }) => `${.6 * scaleBy}px`})
      url(#${filterName})
      ${({
    backlit, scaleBy,
  }) => !backlit && `drop-shadow(0 ${1 * scaleBy}px ${2 * scaleBy}px rgba(20, 0, 10, 0.7))`};
  }
`;

const Container = styled.div<{ background: Color }>`
  label: skeleton-container;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ background }) => background.toString({ format: 'hex' })};
  transition-property: background-color;
  transition-duration: ${transitionDuration};
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0, transparent 30vmax, #000000 80vmax);
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
    const roundedScale = Math.max(1, Math.floor(scale * 2) / 2);
    setScale(roundedScale);
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
              in='SourceGraphic'
              result='opaque'
              values={`
                1 0 0 -1 1
                0 1 0 -1 1
                0 0 1 -1 1
                0 0 0  0 1
              `}
            />
            <feGaussianBlur
              in='opaque'
              stdDeviation={scale * 1.2}
              result='blurred'
            />
            <feBlend
              in='opaque'
              in2='blurred'
              result='lightened'
              mode='lighten'
            />
            <feColorMatrix
              type='matrix'
              in={backlit ? 'lightened' : 'opaque'}
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
      >
        <FilterContainer
          backlit={backlit}
          scaleBy={scale}
        >
          <Content scaleBy={scale}>
            {children}
          </Content>
          <ScanLines
            scaleBy={scale}
          />
        </FilterContainer>
        <Overlay />
      </Container>

    </>
  );
}
