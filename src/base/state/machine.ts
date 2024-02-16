import { UnreachableError } from 'base/errors';

import {
  type State,
  TransitionResult,
} from './types';

export abstract class StateMachine<V, E, O> {
  constructor(
    private currentState: State<V, E, O>,
  ) {

  }

  get value() {
    return this.currentState.value;
  }

  protected abstract beforeTransition(event: E, owner: O, toValue: V): void;

  handleEvent(event: E, owner: O) {
    const [nextState] = this.currentState.transitions
        .reduce<[State<V, E, O>, boolean]>(
          (
            [
              nextState,
              aborted,
            ],
            {
              apply,
              state,
            },
          ) => {
            if (aborted) {
              return [
                nextState,
                true,
              ];
            }
            const transitionResult = apply(event, owner, state.value);
            switch (transitionResult) {
              case TransitionResult.TransitionAndAbort:
                return [
                  state,
                  true,
                ];
              case TransitionResult.Continue:
                return [
                  nextState,
                  false,
                ];
              default:
                throw new UnreachableError(transitionResult);
            }
          },
          [
            this.currentState,
            false,
          ],
        );
    if (nextState !== this.currentState) {
      this.beforeTransition(event, owner, nextState.value);
      this.currentState = nextState;
    }
  }
}
