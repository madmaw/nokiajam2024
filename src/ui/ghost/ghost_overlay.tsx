import styled from '@emotion/styled';
import {
  renderHeight,
  renderWidth,
} from 'base/metrics';
import domToImage from 'dom-to-image';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type GhostOverlayProps = PropsWithChildren<{
  forceUpdateContainer: { forceUpdate: ((canvas?: HTMLCanvasElement | OffscreenCanvas) => void) | undefined },
}>;

const transparencyFilterName = 'transparency-filter';
const alphaThresholdFilterName = 'alpha-threshold-filter';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const OverlayCanvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  image-rendering: pixelated;
  opacity: .5;
  filter: url(#${alphaThresholdFilterName});
  label: ghost-overlay-canvas;
`;

const ChildrenContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  filter: url(#${transparencyFilterName});
  label: ghost-overlay-container;
`;

function getAlpha(now: number, then: number) {
  // note: some of this duration is chopped off by the alpha threshold filter
  const MAX_FADE = 300;
  const delta = Math.min(now - then, MAX_FADE);
  return Math.sqrt(1 - delta / MAX_FADE);
}

export function GhostOverlay({
  children,
  forceUpdateContainer,
}: GhostOverlayProps) {
  const [
    container,
    setContainer,
  ] = useState<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameHandle = useRef<number | undefined>();
  const captureCountRef = useRef<number>(0);

  const offscreenCanvas = useMemo(function() {
    return new OffscreenCanvas(renderWidth, renderHeight);
  }, []);

  const captureCanvas = useMemo(function () {
    return new OffscreenCanvas(renderWidth, renderHeight);
  }, []);

  const captureWithDomToImage = useCallback(function (screenshot?: HTMLCanvasElement | OffscreenCanvas) {
    if (container == null) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx == null) {
      return;
    }
    // draw the previous render to the canvas
    ctx.drawImage(captureCanvas, 0, 0);
    const cctx = captureCanvas.getContext('2d');
    if (cctx == null) {
      return;
    }
    cctx.clearRect(0, 0, renderWidth, renderHeight);
    const captureCount = ++captureCountRef.current;
    if (screenshot != null) {
      cctx.drawImage(screenshot, 0, 0);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async function () {
      const pixelData = await domToImage.toPixelData(container, {
        width: renderWidth,
        height: renderHeight,
      });

      // render to canvas
      if (captureCount !== captureCountRef.current) {
        return;
      }
      const imageData = cctx.createImageData(renderWidth, renderHeight);
      imageData.data.set(pixelData.slice(0, renderWidth * renderHeight * 4));
      cctx.putImageData(imageData, 0, 0);
    })();
  }, [
    container,
    captureCanvas,
  ]);

  useEffect(function () {
    forceUpdateContainer.forceUpdate = captureWithDomToImage;
  }, [
    forceUpdateContainer,
    captureWithDomToImage,
  ]);

  useEffect(function () {
    if (container == null) {
      return;
    }
    const observer = new MutationObserver(function () {
      // need to wrap in function as mutation observer has args
      captureWithDomToImage();
    });
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    return function () {
      observer.disconnect();
    };
  }, [
    container,
    captureWithDomToImage,
  ]);

  const then = useRef<number>(0);
  const animate = useCallback(function (now: number) {
    animationFrameHandle.current = requestAnimationFrame(animate);
    const ctx = canvasRef.current?.getContext('2d');
    const octx = offscreenCanvas.getContext('2d');
    if (octx == null || ctx == null) {
      return;
    }
    // copy to offscreen canvas
    octx.clearRect(0, 0, renderWidth, renderHeight);
    octx.drawImage(ctx.canvas, 0, 0);
    // copy back to onscreen canvas with lower alpha
    ctx.clearRect(0, 0, renderWidth, renderHeight);
    ctx.save();
    ctx.globalAlpha = getAlpha(now, then.current);
    ctx.drawImage(offscreenCanvas, 0, 0);
    ctx.restore();
    then.current = now;
  }, [offscreenCanvas]);

  useEffect(function () {
    animate(0);
    return function () {
      if (animationFrameHandle.current != null) {
        cancelAnimationFrame(animationFrameHandle.current);
      }
    };
  }, [animate]);
  return (
    <Container>
      <svg
        width={0}
        height={0}
      >
        <defs>
          {/* filter to hide alpha values under 30% */}
          <filter id={alphaThresholdFilterName}>
            <feColorMatrix
              type='matrix'
              in='SourceGraphic'
              values={`
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 1 -.3
              `}
            />
          </filter>

          {/* filter to make red (white, given we only support two colors) transparent */}
          <filter id={transparencyFilterName}>
            <feColorMatrix
              type='matrix'
              in='SourceGraphic'
              values={`
                 1 0 0 0 0
                 0 1 0 0 0
                 0 0 1 0 0
                -1 0 0 1 0
              `}
            />
          </filter>
        </defs>
      </svg>

      <ChildrenContainer ref={setContainer}>
        {children}
      </ChildrenContainer>
      <OverlayCanvas
        ref={canvasRef}
        width={renderWidth}
        height={renderHeight}
      />
    </Container>
  );
}
