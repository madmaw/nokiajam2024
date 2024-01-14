import {
  type ScreenComponent,
  type ScreenProps,
} from './screen';

type Screen = {
  readonly Component: ScreenComponent,
  readonly key: string,
};

export type StackProps = {
  readonly screens: readonly Screen[]
} & ScreenProps;

export function Stack({
  screens,
  input,
}: StackProps) {
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
          />
        );
      })}
    </div>
  );
}
