import styled from '@emotion/styled';
import { fill } from 'base/colors';
import {
  renderHeight,
  renderWidth,
} from 'base/metrics';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatedGif } from 'ui/gif/animated_gif';

export type AnimatedSplashScreenProps = {
  gifUrl: string,
  backgroundUrl: string,
  animationComplete: () => void,
  animationChanged?: (canvas: HTMLCanvasElement | OffscreenCanvas) => void,
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${fill.toString({ format: 'hex' })};
`;

const Background = styled.img`
  position: absolute;
  width: 100%;
  image-rendering: pixelated;
`;

const Foreground = styled(AnimatedGif)`
  position: absolute;
  width: 100%;
  image-rendering: pixelated;
`;

export function AnimatedSplashScreen({
  gifUrl,
  backgroundUrl,
  animationComplete,
  animationChanged,
}: AnimatedSplashScreenProps) {
  const [
    backgroundLoaded,
    setBackgroundLoaded,
  ] = useState(false);
  const backgroundRef = useRef<HTMLImageElement>(null);
  const onGifError = useCallback(function (e: unknown) {
    // TODO log error
    console.error('failed to load splash screen gif', gifUrl, e);
    animationComplete();
  }, [
    animationComplete,
    gifUrl,
  ]);
  const onBackgroundError = useCallback(function (e: unknown) {
    // TODO log error
    console.error('failed to load splash screen background', backgroundUrl, e);
    animationComplete();
  }, [
    animationComplete,
    backgroundUrl,
  ]);
  const onBackgroundLoad = useCallback(function () {
    setBackgroundLoaded(true);
  }, []);
  const offscreenCanvas = useMemo(function () {
    return new OffscreenCanvas(renderWidth, renderHeight);
  }, []);
  // add the background to the animation frame
  const animationChangedWithBackground = useCallback(function (frame: HTMLCanvasElement) {
    if (animationChanged == null) {
      return;
    }
    const ctx = offscreenCanvas.getContext('2d');
    const background = backgroundRef.current;
    if (ctx == null || background == null) {
      animationChanged(frame);
      return;
    }
    ctx.clearRect(0, 0, renderWidth, renderHeight);
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(frame, 0, 0);
    animationChanged(offscreenCanvas);
  }, [
    animationChanged,
    offscreenCanvas,
  ]);
  return (
    <Container>
      <Background
        ref={backgroundRef}
        src={backgroundUrl}
        onLoad={onBackgroundLoad}
        onError={onBackgroundError}
      />
      {backgroundLoaded && (
        <Foreground
          src={gifUrl}
          onError={onGifError}
          onAnimationEnd={animationComplete}
          onFrame={animationChangedWithBackground}
        />
      )}
    </Container>
  );
}
