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

type Screen = {
  readonly Component: ComponentType<MaybeWithInput<{
    requestPop: (() => void) | undefined,
  }>>,
  readonly key: string,
};

export type StackProps = MaybeWithInput<{
  readonly screens: readonly Screen[],
  readonly requestPop: () => void,
}>;

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
    <div>
      {screens.map(function (
        {
          Component,
          key,
        },
        index,
      ) {
        return (
          <Component
            key={key}
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
        );
      })}
    </div>
  );
}
