import styled from '@emotion/styled';
import { pxPerNpx } from 'base/metrics';
import {
  decompressFrames,
  type ParsedFrame,
  parseGIF,
} from 'gifuct-js';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

export type AnimatedGifProps = {
  src: string,
  loop?: boolean,
  onLoad?: () => void,
  onError?: (e: unknown) => void,
  onAnimationEnd?: () => void,
  onFrame?: (canvas: HTMLCanvasElement, index: number) => void,
  className?: string,
};

const AnimatedGifCanvas = styled.canvas`
  image-rendering: pixelated;
`;

export function AnimatedGif({
  src,
  onLoad,
  onError,
  onFrame,
  onAnimationEnd,
  className,
  loop,
}: AnimatedGifProps) {
  const [
    frames,
    setFrames,
  ] = useState<readonly ParsedFrame[] | null>(null);
  const [
    progress,
    setProgress,
  ] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [
    styledHeight,
    setStyledHeight,
  ] = useState<string | undefined>(undefined);

  useEffect(function () {
    let canceled = false;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async function() {
      try {
        const resp = await fetch(src);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (canceled) {
          return;
        }
        const buff = await resp.arrayBuffer();
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (canceled) {
          return;
        }
        const gif = parseGIF(buff);
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = gif.lsd.width;
          canvas.height = gif.lsd.height;
        }
        setStyledHeight(`${gif.lsd.height * pxPerNpx}px`);

        const frames = decompressFrames(gif, true);
        setFrames(frames.length > 6 ? frames.slice(0) : frames);
        onLoad?.();
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (canceled) {
          return;
        }
        onError?.(e);
      }
    })();
    return function () {
      canceled = true;
    };
  }, [
    src,
    onError,
    onLoad,
  ]);

  useEffect(function () {
    const canvas = canvasRef.current;
    if (frames == null || canvas == null) {
      return;
    }
    const index = progress % frames.length;
    const frame = frames[index];
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    const previousIndex = index === 0
      ? frames.length - 1
      : index - 1;
    const replace = frames[previousIndex].disposalType === 2;
    if (replace) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
      imageData.data.set(frame.patch);
      ctx.putImageData(
        imageData,
        frame.dims.left,
        frame.dims.top,
      );
    } else {
      const temp = document.createElement('canvas');
      temp.width = frame.dims.width;
      temp.height = frame.dims.height;
      const tempCtx = temp.getContext('2d');
      if (tempCtx == null) {
        return;
      }
      const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
      imageData.data.set(frame.patch);
      tempCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(
        temp,
        frame.dims.left,
        frame.dims.top,
      );
    }
    onFrame?.(canvas, progress);
    const handle = setTimeout(function () {
      const nextProgress = progress + 1;
      if (nextProgress >= frames.length && !loop) {
        onAnimationEnd?.();
      } else {
        setProgress(nextProgress % frames.length);
      }
    }, frame.delay);
    return function () {
      clearTimeout(handle);
    };
  }, [
    frames,
    progress,
    onAnimationEnd,
    onFrame,
    loop,
  ]);

  return (
    <AnimatedGifCanvas
      ref={canvasRef}
      className={className}
      style={{
        height: styledHeight,
      }}
    />
  );
}
