import { type State } from './types';

export class StateMachine<V, E, O> {
  constructor(private currentState: State<V, E, O>) {

  }

  get value() {
    return this.currentState.value;
  }

  handleEvent(event: E, owner: O) {
    const nextState = this.currentState.transitions
        .find(function (transition) {
          return transition.apply(event, owner);
        })?.state;
    if (nextState != null) {
      this.currentState = nextState;
    }
  }
}
