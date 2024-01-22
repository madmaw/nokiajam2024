import styled from '@emotion/styled';
import { fill } from 'base/colors';
import { delay } from 'base/delay';
import { pxPerNpx } from 'base/metrics';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import bgUrl from './resources/bg.png';
import bigHandUrl from './resources/big_hand.png';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${fill.toString({ format: 'hex' })};
`;

const Background = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
`;

const BigHand = styled.img<{
  marginLeft: number,
  marginTop: number,
  hidden: boolean,
}>`
  position: absolute;
  height: 100%;
  image-rendering: pixelated;
  margin-top: ${({ marginTop }) => marginTop * pxPerNpx}px;
  margin-left: ${({ marginLeft }) => marginLeft * pxPerNpx}px;
  display: ${({ hidden }) => hidden ? 'none' : 'block'};
`;

type State = {
  type: 'loadingBackground',
} | {
  type: 'loadingHands',
  bigHandLoaded: boolean,
  smallHandLoaded: boolean,
} | {
  type: 'animating',
  progress: number,
};

export function NokiaSplashScreen({
  animationComplete,
}: {
  animationComplete: () => void,
}) {
  const bigHandRef = useRef<HTMLImageElement | null>(null);
  const [
    state,
    setState,
  ] = useState<State>({
    type: 'loadingBackground',
  });

  const onComplete = useCallback(async function (duration: number) {
    await delay(duration);
    animationComplete();
  }, [animationComplete]);

  const onError = useCallback(function () {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    onComplete(0);
  }, [onComplete]);

  const onBackgroundLoad = useCallback(function () {
    setState({
      type: 'loadingHands',
      bigHandLoaded: false,
      smallHandLoaded: true,
    });
  }, []);
  const onBigHandLoaded = useCallback(function () {
    const bigHand = bigHandRef.current;
    if (bigHand == null) {
      // exit early something has gone wrong
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      onComplete(0);
      return;
    }
    setState({
      type: 'animating',
      progress: 0,
    });
  }, [onComplete]);

  useEffect(function () {
    if (state.type === 'animating') {
      if (state.progress < 100) {
        const handle = setTimeout(function () {
          setState({
            type: 'animating',
            progress: state.progress + 25,
          });
        }, 300);
        return function () {
          clearTimeout(handle);
        };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        onComplete(1000);
      }
    }
  }, [
    state,
    onComplete,
  ]);

  useEffect(function () {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    onComplete(5000);
  }, [onComplete]);
  const marginLeft = state.type === 'animating' && bigHandRef.current ? Math.round((Math.sqrt(state.progress / 100) - 1) * bigHandRef.current.naturalWidth) : 0;
  const marginTop = state.type === 'animating' && bigHandRef.current ? Math.round((1 - Math.sqrt(state.progress / 100)) * bigHandRef.current.naturalHeight) : 0;
  return (
    <Container>
      <Background
        src={bgUrl}
        onLoad={onBackgroundLoad}
        onError={onError}
      />
      {state.type !== 'loadingBackground' && (
        <BigHand
          marginTop={marginTop}
          marginLeft={marginLeft}
          hidden={state.type !== 'animating'}
          ref={bigHandRef}
          src={bigHandUrl}
          onLoad={onBigHandLoaded}
          onError={onError}
        />
      )}
    </Container>
  );
}
