import { UnreachableError } from 'base/errors';
import { type StateBuilder } from 'base/state/builder';
import {
  type TransitionApplicator,
  TransitionResult,
} from 'base/state/types';
import {
  decompressFrames,
  parseGIF,
} from 'gifuct-js';

import { type EntityStateBuilder } from './builder';
import {
  type Entity,
  type EntityStateValue,
  type EntityTransition,
  type EntityTransitionApplicator,
  EntityTransitionType,
  LateralDirection,
  type Orientation,
  OrientationCardinalEast,
  OrientationCardinalNorth,
  OrientationCardinalSouth,
  OrientationCardinalWest,
  OrientationLateralLeft,
  OrientationLateralRight,
  OrientationType,
} from './entity';

export type AnimationFrameGroup = {
  readonly id: string,
  readonly wrapAnimation: boolean,
  readonly animationFrames: readonly AnimationFrame[],
  readonly orientationType: OrientationType,
};

export type AnimationFrame = {
  readonly index: number,
  readonly ticks?: number,
};

// useful for clients attribute transitions across orientation groups
export const orientationGroupAttributes: ReadonlySet<'orientation'> = new Set(['orientation']);

function createOrientationGroups(parentState: StateBuilder<EntityStateValue, EntityTransition, Entity>, orientationType: OrientationType) {
  const namePrefix = parentState.value.name != null ? `${parentState.value.name}-` : '';
  switch (orientationType) {
    case OrientationType.Omnidirectional:
      return [parentState];
    case OrientationType.Lateral:
      return [
        parentState.createChild({
          name: `${namePrefix}right`,
          orientation: OrientationLateralRight,
        }),
        parentState.createChild({
          name: `${namePrefix}left`,
          orientation: OrientationLateralLeft,
        }),
      ];
    case OrientationType.Cardinal:
      return [
        parentState.createChild({
          name: `${namePrefix}east`,
          orientation: OrientationCardinalEast,
        }),
        parentState.createChild({
          name: `${namePrefix}north`,
          orientation: OrientationCardinalNorth,
        }),
        parentState.createChild({
          name: `${namePrefix}west`,
          orientation: OrientationCardinalWest,
        }),
        parentState.createChild({
          name: `${namePrefix}south`,
          orientation: OrientationCardinalSouth,
        }),
      ];
    default:
      throw new UnreachableError(orientationType);
  }
}

function transformCanvas(canvas: HTMLCanvasElement | OffscreenCanvas, orientation: Orientation | undefined) {
  const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
  const ctx = offscreen.getContext('2d');
  if (ctx == null) {
    throw new Error('Failed to get 2d context');
  }
  ctx.imageSmoothingEnabled = false;
  ctx.save();
  if (
    orientation == null ||
    orientation.type === OrientationType.Omnidirectional ||
    orientation.type === OrientationType.Lateral && orientation.direction === LateralDirection.Right
  ) {
    // do nothing
  } else if (orientation.type === OrientationType.Lateral && orientation.direction === LateralDirection.Left) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  } else {
    const angle = orientation.direction * (Math.PI / 2);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }
  ctx.drawImage(canvas, 0, 0);
  ctx.restore();
  return offscreen;
}

export type Importer = (
  parentStateBuilder: EntityStateBuilder,
  groups: AnimationFrameGroup[],
) => EntityStateBuilder[];

export function createApplyWhenFrameCompleted(applicator: TransitionApplicator<EntityStateValue, EntityTransition, Entity>): EntityTransitionApplicator {
  return function (e, o, s) {
    return e.type === EntityTransitionType.Update && e.frameComplete
      ? applicator(e, o, s)
      : TransitionResult.Continue;

  };
}

export function createApplyWhenDifferentFrameGroup(applicator: EntityTransitionApplicator): EntityTransitionApplicator {
  return function (e, o, v) {
    return o.state.value.frameGroupId !== v.frameGroupId
      ? applicator(e, o, v)
      : TransitionResult.Continue;
  };
}

export function createApplyWhenUnrelatedFrameGroup(applicator: EntityTransitionApplicator): EntityTransitionApplicator {
  return function (e, o, v) {
    return !o.state.value.frameGroupId.startsWith(v.frameGroupId)
      ? applicator(e, o, v)
      : TransitionResult.Continue;
  };
}

export const applyFrameAnimated = createApplyWhenFrameCompleted(function () {
  return TransitionResult.TransitionAndContinue;
});

export async function importEntityStatesFromAnimatedGif(
    src: string,
): Promise<Importer> {
  const resp = await fetch(src);
  const buff = await resp.arrayBuffer();
  const gif = parseGIF(buff);
  const frames = decompressFrames(gif, true);

  const canvases = frames.map((frame) => {
    const canvas = new OffscreenCanvas(gif.lsd.width, gif.lsd.height);
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      throw new Error('Failed to get 2d context');
    }
    const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
    imageData.data.set(frame.patch);
    ctx.putImageData(imageData, frame.dims.left, frame.dims.top);
    return canvas;
  });

  return function (
    parentStateBuilder: EntityStateBuilder,
    groups: AnimationFrameGroup[],
  ) {
    return groups.map(function ({
      id,
      animationFrames,
      orientationType,
      wrapAnimation,
    }) {
      const groupState = parentStateBuilder.createChild({
        name: id,
        frameGroupId: id,
      });

      const animationOrientationStates = createOrientationGroups(groupState, orientationType);

      // add in the individual frames for each orientation
      animationOrientationStates.forEach(
        function (animationOrientationState) {
          const orientationAnimationStateBuilders = animationFrames.map(
            function ({
              index,
              ticks: maybeTicks,
            }, frameIndex) {
              const originalCanvas = canvases[index];
              const canvas = transformCanvas(originalCanvas, animationOrientationState.value.orientation);
              const frame = frames[index];
              const ticks = maybeTicks ?? Math.ceil(frame.delay / 100);
              return animationOrientationState.createChild({
                name: `${animationOrientationState.value.name}-${frameIndex}`,
                canvas,
                ticks,
              });
            },
          );
          // connect wrapping animations
          orientationAnimationStateBuilders.forEach(
            function (state, index) {
              // connect frames
              const next = orientationAnimationStateBuilders[(index + 1) % orientationAnimationStateBuilders.length];
              if (index < orientationAnimationStateBuilders.length - 1 || wrapAnimation) {
                state.addTransition(
                  next,
                  applyFrameAnimated,
                  2,
                );
              }
            },
          );
        },
      );
      return groupState;
    });
  };
}
