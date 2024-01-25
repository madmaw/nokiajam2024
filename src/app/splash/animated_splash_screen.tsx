import styled from '@emotion/styled';
import { fill } from 'base/colors';
import {
  useCallback,
  useState,
} from 'react';
import { AnimatedGif } from 'ui/gif/animated_gif';

export type AnimatedSplashScreenProps = {
  gifUrl: string,
  backgroundUrl: string,
  animationComplete: () => void,
  animationChanged?: () => void,
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
  return (
    <Container>
      <Background
        src={backgroundUrl}
        onLoad={onBackgroundLoad}
        onError={onBackgroundError}
      />
      {backgroundLoaded && (
        <Foreground
          src={gifUrl}
          onError={onGifError}
          onAnimationEnd={animationComplete}
          onFrame={animationChanged}
        />
      )}
    </Container>
  );
}
