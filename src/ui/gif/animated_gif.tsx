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
  onLoad?: () => void,
  onError?: (e: unknown) => void,
  onAnimationEnd?: () => void,
  onFrame?: (index: number) => void,
  className?: string,
};

export function AnimatedGif({
  src,
  onLoad,
  onError,
  onFrame,
  onAnimationEnd,
  className,
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

        setFrames(decompressFrames(gif, true));
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
    const loops = 1;
    const frame = frames[progress % frames.length];
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    const replace = progress > 0 && frames[(progress - 1)%frames.length].disposalType === 2;
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
    onFrame?.(progress);
    const handle = setTimeout(function () {
      const nextProgress = progress + 1;
      if (nextProgress >= frames.length * loops) {
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
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
    />
  );
}
