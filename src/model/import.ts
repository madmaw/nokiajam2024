import { type StateBuilder } from 'base/state/builder';
import {
  decompressFrames,
  parseGIF,
} from 'gifuct-js';

import {
  type Entity,
  type EntityState,
  type EntityTransition,
  EntityTransitionType,
} from './entity';

export type AnimationFrameGroup = {
  readonly name: string,
  readonly wrap: boolean,
  readonly animationFrames: readonly AnimationFrame[],
};

export type AnimationFrame = {
  readonly index: number,
  readonly ticks?: number,
};

export async function importEntityStatesFromAnimatedGif(
    src: string,
    parentState: StateBuilder<EntityState, EntityTransition, Entity>,
    groups: AnimationFrameGroup[],
): Promise<StateBuilder<EntityState, EntityTransition, Entity>[]> {
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

  return groups.map(function ({
    name,
    animationFrames,
    wrap,
  }) {
    const groupState = parentState.addChild({
      name,
    });
    const animationFrameStates = animationFrames.map(
      function ({
        index,
        ticks: maybeTicks,
      }) {
        const canvas = canvases[index];
        const frame = frames[index];
        const ticks = maybeTicks ?? Math.ceil(frame.delay/100);
        const frameState = groupState.addChild({
          canvas,
          ticks,
        });
        return frameState;
      },
    );
    // connect
    animationFrameStates.forEach(
      function (state, index) {
        const next = animationFrameStates[(index + 1) % animationFrameStates.length];
        if (index < animationFrameStates.length - 1 || wrap) {
          state.addTransition(
            next,
            function (e: EntityTransition, o: Entity) {
              if (e.type === EntityTransitionType.Tick) {
                o.ticksRemaining--;
                return o.ticksRemaining <= 0;
              }
              return false;
            },
          );
        }
      },
    );

    return groupState;
  });
}
