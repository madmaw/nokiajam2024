import styled from '@emotion/styled';
import {
  type KeyStates,
  readKeyState,
} from 'base/key_state';
import {
  pxPerNpx,
  screenHeight,
  screenWidth,
} from 'base/metrics';
import {
  type Entity,
  EntityTransitionFrameAnimated,
  EntityTransitionHaltLateral,
  EntityTransitionMoveLateralLeft,
  EntityTransitionMoveLateralRight,
  EntityTransitionMoveLowerDuck,
  EntityTransitionMoveLowerNone,
} from 'model/entity';
import {
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { InputAction } from 'ui/input';

type TestStateProps = {
  entity: Entity,
  onFrame: (canvas: HTMLCanvasElement) => void,
  keyStates: KeyStates,
};

const TestCanvas = styled.canvas`
  image-rendering: pixelated;
  width: ${screenWidth * pxPerNpx}px;
  height: ${screenHeight * pxPerNpx}px;
`;

const millisecondsPerRender = 1000 / 15;

export function TestState({
  entity,
  onFrame,
  keyStates,
}: TestStateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<number | null>(null);
  const thenRef = useRef<number | null>(null);
  const drawRef = useRef<number>(0);

  const update = useCallback(function (now: number) {
    const diff = Math.min(millisecondsPerRender, now - (thenRef.current ?? now));
    thenRef.current = now;
    handleRef.current = requestAnimationFrame(update);
    drawRef.current += diff;
    const draw = drawRef.current > millisecondsPerRender || now === 0;
    const right = readKeyState(keyStates, InputAction.Right);
    const left = readKeyState(keyStates, InputAction.Left);
    const down = readKeyState(keyStates, InputAction.Down);

    if (diff > 0 && draw) {
      entity.ticksRemaining = Math.max(0, entity.ticksRemaining - 1);
      if (entity.ticksRemaining === 0) {
        entity.state.handleEvent(EntityTransitionFrameAnimated, entity);
      }
    }

    const moveLowerEvent = down
      ? EntityTransitionMoveLowerDuck
      : EntityTransitionMoveLowerNone;
    entity.state.handleEvent(moveLowerEvent, entity);

    const lateralMovementEvent = left && !right || right && !left
      ? left
        ? EntityTransitionMoveLateralLeft
        : EntityTransitionMoveLateralRight
      : EntityTransitionHaltLateral;
    entity.state.handleEvent(lateralMovementEvent, entity);
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    // draw at 15 FPS, but update as fast as possible
    if (draw) {
      const {
        canvas: entityCanvas,
      } = entity.state.value;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(entityCanvas, 0, 0);
      onFrame(canvas);
      drawRef.current = Math.max(0, Math.min(millisecondsPerRender, drawRef.current - millisecondsPerRender));
    }
  }, [
    onFrame,
    entity,
    keyStates,
  ]);

  useEffect(function () {
    handleRef.current = requestAnimationFrame(update);
    return function () {
      const handle = handleRef.current;
      if (handle != null) {
        cancelAnimationFrame(handle);
      }
    };
  }, [update]);

  return (
    <TestCanvas
      ref={canvasRef}
      width={screenWidth}
      height={screenHeight}
    />
  );
}
