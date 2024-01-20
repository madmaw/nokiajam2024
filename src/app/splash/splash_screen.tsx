import styled from '@emotion/styled';
import { fill } from 'base/colors';
import { delay } from 'base/delay';
import { useEffect } from 'react';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${fill.toString({ format: 'hex' })};
`;

export function SplashScreen({
  animationComplete,
}: {
  animationComplete: () => void,
}) {
  useEffect(function () {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async function () {
      await delay(1000);
      animationComplete();
    })();
  }, [animationComplete]);
  return (
    <Container/>
  );
}
