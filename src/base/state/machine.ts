import { UnreachableError } from 'base/errors';

import {
  type State,
  TransitionResult,
} from './types';

export abstract class StateMachine<V, E, O> {
  constructor(
    private currentState: State<V, E, O>,
    private readonly overlapChecker: (e: E, s1: State<V, E, O>, s2: State<V, E, O>) => boolean,
  ) {

  }

  get value() {
    return this.currentState.value;
  }

  protected abstract beforeTransition(_event: E, _to: V, _owner: O): void;

  handleEvent(event: E, owner: O) {
    const nextState = this.currentState.transitions
        .reduce<State<V, E, O> | null>(
          (
            maybeCurrentState,
            {
              apply,
              state,
            },
          ) => {
            if (maybeCurrentState) {
              return maybeCurrentState;
            }
            const transitionResult = apply(event, owner);
            switch (transitionResult) {
              case TransitionResult.Transition:
                return state;
              case TransitionResult.Abort:
                return this.currentState;
              case TransitionResult.TryNext:
                return null;
              default:
                throw new UnreachableError(transitionResult);
            }
          },
          null,
        );
    if (nextState != null && !this.overlapChecker(event, nextState, this.currentState)) {
      this.beforeTransition(event, nextState.value, owner);
      this.currentState = nextState;
    }
  }
}
