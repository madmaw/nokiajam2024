import { UnreachableError } from 'base/errors';
import { observer } from 'mobx-react';
import { type IPromiseBasedObservable } from 'mobx-utils';
import { type ComponentType } from 'react';

export type LoadingProps<T, C> = {
  observable: IPromiseBasedObservable<T>,
  Pending: ComponentType,
  Rejected: ComponentType<{
    error: unknown,
  }>,
  Fulfilled: ComponentType<{
    value: T,
  } & C>,
} & C;

export const Loading = observer(function<T, C = {}>({
  Rejected,
  Pending,
  Fulfilled,
  observable,
  ...common
}: LoadingProps<T, C>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  switch (observable.state) {
    case 'pending':
      return (
        <Pending/>
      );
    case 'rejected':
      return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        <Rejected error={observable.value}/>
      );
    case 'fulfilled':
      return (
        <Fulfilled
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          value={observable.value}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
          {...common as any}
        />
      );
    default:
      throw new UnreachableError(observable);
  }
});
