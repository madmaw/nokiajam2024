import { UnreachableError } from 'base/errors';
import { observer } from 'mobx-react';
import { type IPromiseBasedObservable } from 'mobx-utils';
import { type ComponentType } from 'react';

export type LoadingProps<T, C> = {
  observable: IPromiseBasedObservable<T>,
  Pending: ComponentType<C>,
  Rejected: ComponentType<{
    error: unknown,
  } & C>,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
        <Pending {...common as any}/>
      );
    case 'rejected':
      return (
        <Rejected
          error={observable.value}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions
          {...common as any}
        />
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
