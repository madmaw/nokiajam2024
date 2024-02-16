import {
  action,
  computed,
  observable,
} from 'mobx';

type Update = {
  readonly time: number,
  readonly render: boolean,
}

export class FrameCounter {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  @observable.shallow
  private accessor updates: Update[];

  @observable.ref
    accessor updating = false;

  constructor(
    private readonly maxUpdates = 500,
    private readonly sampleDuration= 2000,
  ) {
    this.updates = [];
  }

  @action
  addUpdate(time: number, render: boolean) {
    this.updates.unshift({
      time,
      render,
    });
    if (this.updates.length > this.maxUpdates) {
      this.updates.splice(this.maxUpdates, this.updates.length - this.maxUpdates);
    }
  }

  @computed
  get framesPerSecond() {
    if (this.updates.length === 0) {
      return 0;
    }
    const now = this.updates[0].time;
    return this.calculateFPS(true, now);
  }

  @computed
  get updatesPerSecond() {
    if (this.updates.length === 0) {
      return 0;
    }
    const now = this.updates[0].time;
    return this.calculateFPS(false, now);
  }

  private calculateFPS(onlyRender: boolean, now: number) {
    const maxDuration = Math.min(
      this.updates.length > 0
        ? now - this.updates[this.updates.length - 1].time
        : this.sampleDuration,
      this.sampleDuration,
    );
    const count = this.updates.reduce<number>((
      count,
      {
        time,
        render,
      },
    ) => {
      if ((onlyRender && render || !onlyRender) && now - time <= maxDuration) {
        return count+1;
      }
      return count;
    }, 0);
    return Math.round((count * 1000) / maxDuration);
  }

}
