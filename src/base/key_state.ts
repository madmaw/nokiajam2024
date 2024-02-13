import { InputAction } from 'ui/input';

export type KeyState = {
  set: boolean,
  read: boolean,
}

export type KeyStates = Record<InputAction, KeyState>;

function createKeyState(): KeyState {
  return {
    set: false,
    read: true,
  };
}

export function createKeyStates(): KeyStates {
  return {
    [InputAction.Up]: createKeyState(),
    [InputAction.Down]: createKeyState(),
    [InputAction.Left]: createKeyState(),
    [InputAction.Right]: createKeyState(),
    [InputAction.Select]: createKeyState(),
    [InputAction.Back]: createKeyState(),
  };
}

export function setKeyState(keyStates: KeyStates, action: InputAction) {
  const keyState = keyStates[action];
  if (!keyState.set) {
    keyState.set = true;
    keyState.read = false;
  }
}

export function unsetKeyState(keyStates: KeyStates, action: InputAction) {
  const keyState = keyStates[action];
  if (keyState.set) {
    keyState.set = false;
  }
}

export function readKeyState(keyStates: KeyStates, action: InputAction) {
  const keyState = keyStates[action];
  const result = keyState.set || !keyState.read;
  keyState.read = true;
  return result;
}
