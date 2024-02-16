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
import { runInAction } from 'mobx';
import {
  type Entity,
  type EntityTransition,
  EntityTransitionType,
  LateralDirection,
  LateralInputNeutral,
} from 'model/entity';
import {
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { type FrameCounter } from 'ui/debug/types';
import { InputAction } from 'ui/input';

type TestStateProps = {
  entity: Entity,
  onFrame: (canvas: HTMLCanvasElement) => void,
  keyStates: KeyStates,
  frameCounter: FrameCounter,
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
  frameCounter,
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
    const firstRender = now === 0;
    const draw = drawRef.current > millisecondsPerRender || now === 0;
    const right = readKeyState(keyStates, InputAction.Right);
    const left = readKeyState(keyStates, InputAction.Left);
    const lateral = left && right || !left && !right
      ? LateralInputNeutral.Neutral
      : left
        ? LateralDirection.Left
        : LateralDirection.Right;
    const down = readKeyState(keyStates, InputAction.Down);

    if (!firstRender && draw) {
      entity.ticksRemaining = Math.max(0, entity.ticksRemaining - 1);
    }

    const frameComplete = entity.ticksRemaining === 0;

    const transition: EntityTransition = {
      type: EntityTransitionType.Update,
      player: true,
      frameComplete,
      down,
      jump: false,
      lateral,
    };
    entity.state.handleEvent(transition, entity);

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
    frameCounter.addUpdate(now, draw);
  }, [
    onFrame,
    entity,
    keyStates,
    frameCounter,
  ]);

  useEffect(function () {
    handleRef.current = requestAnimationFrame(update);
    runInAction(function () {
      frameCounter.updating = true;
    });
    return function () {
      const handle = handleRef.current;
      runInAction(function () {
        frameCounter.updating = false;
      });
      if (handle != null) {
        cancelAnimationFrame(handle);
      }
    };
  }, [
    update,
    frameCounter,
  ]);

  return (
    <TestCanvas
      ref={canvasRef}
      width={screenWidth}
      height={screenHeight}
    />
  );
}
