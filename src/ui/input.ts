export type Input = {
  action: InputAction,
  source: string,
  down: boolean,
}

export const enum InputAction {
  Up,
  Down,
  Left,
  Right,
  Select,
}
