import styled from '@emotion/styled';
import { transparency } from 'base/colors';
import {
  type ComponentType,
  useCallback,
} from 'react';
import {
  type Input,
  InputAction,
  InputProgress,
  type MaybeWithInput,
  useOutput,
} from 'ui/input';

export type ScreenComponentProps = MaybeWithInput<{
  requestPop: (() => void) | undefined,
}>;

export type ScreenComponent = ComponentType<ScreenComponentProps>;

export type Screen = {
  readonly Component: ScreenComponent,
  readonly key: string,
};

export type StackProps = MaybeWithInput<{
  readonly screens: readonly Screen[],
  readonly requestPop: () => void,
}>;

const Container = styled.div`
  position: relative;
  min-height: 0;
  height: 100%;
`;

const ScreenContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  min-height: 0;
  height: 100%;
  background-color: ${transparency.toString({ format: 'hex' })};
`;

export function Stack({
  screens,
  input,
  output,
  requestPop,
}: StackProps) {

  // may not belong here (perhaps the individual screens should be responsible for this)
  const outputHandler = useCallback(function ({
    action, progress,
  }: Input) {
    switch (action) {
      case InputAction.Back:
        if (progress === InputProgress.Commit) {
          requestPop();
          return true;
        }
        return;
      default:
    }
  }, [requestPop]);
  const childOutput = useOutput(output, outputHandler);

  return (
    <Container>
      {screens.map(function (
        {
          Component,
          key,
        },
        index,
      ) {
        return (
          <ScreenContainer key={ key }>
            <Component

              input={
                index === screens.length - 1
                  ? input
                  : undefined
              }
              output={
                index === screens.length - 1
                  ? childOutput
                  : undefined
              }
              requestPop={
                index === screens.length - 1
                  ? requestPop
                  : undefined
              }
            />
          </ScreenContainer>
        );
      })}
    </Container>
  );
}
