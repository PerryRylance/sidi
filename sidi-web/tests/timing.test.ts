import { describe, test, expect, beforeAll } from 'vitest';
import { EndOfTrackEvent, File, SetTempoEvent, Track } from "@perry-rylance/midi";
import createSIDModule from '../compiled/libresidfp';
import Driver from '../src/Driver';

describe('driver timing', () => {
  let module: any;

  beforeAll(async () => {
    module = await createSIDModule({});
  });

  describe.each([
    { ticksPerQuarterNote: 24 },
    { ticksPerQuarterNote: 96 },
    { ticksPerQuarterNote: 480 },
    { ticksPerQuarterNote: 960 },
  ])('with $ticksPerQuarterNote ppqn', ({ ticksPerQuarterNote }) => {

    test.each([
      [4, 120, 88200],
      [4, 60, 176400],
      [4, 180, 58800]
    ])('for %i beats at %i bpm writes %i samples', (beats, bpm, expectation) => {

      const file = new File();
      file.resolution.ticksPerQuarterNote = ticksPerQuarterNote;

      const track = new Track();
      file.tracks.push(track);

      const tempo = new SetTempoEvent();
      tempo.bpm = bpm;
      track.events.push(tempo);

      const eot = new EndOfTrackEvent(ticksPerQuarterNote * beats);
      track.events.push(eot);

      // NB: Resampler has internal state, group delay, fractional phase steps, and filtering overhead. To fully flush the requested clock cycles, the resampler generates extra samples.
      // TODO: This is worth looking further into because it's going to cause timing drift especially if we're syncing animations up to the output. The bot assures me that this is a localized jitter and won't become a cumulative drift, may be worth running some tests on this with pieces several minutes long.
      const overshoot = 32;
      const pcmBuffer = new Int16Array(expectation + overshoot);

      const sid = new module.SID();
      const driver = new Driver(sid, file.resolution);
      const result = driver.process(track, pcmBuffer);

      // NB: Allow for overshoot (see above)
      expect(result).toBeGreaterThanOrEqual(expectation);

    })
  });

});
