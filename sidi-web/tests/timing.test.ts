import path from 'path';
import { describe, test, expect, beforeAll } from 'vitest';
import { EndOfTrackEvent, File, SetTempoEvent, Track } from "@perry-rylance/midi";
import createSIDModule from '../compiled/libresidfp';
import Processor from '../src/Processor';
import SidChipAdapter from '../src/SidChipAdapter';
import OnsetDetector from '../src/OnsetDetector';
import renderMidiToPcm from '../src/renderMidiToPcm';
import loadMidiFile from '../scripts/load-midi-file';

describe('processor timing', () => {
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

      const sid = new SidChipAdapter(new module.SID());
      const processor = new Processor(sid, file);
      const result = processor.process(pcmBuffer);

      // NB: Allow for overshoot (see above)
      expect(result).toBeGreaterThanOrEqual(expectation);

    })
  });

  test('boots and cats renders accurately', async () => {
    const midi = await loadMidiFile(path.join(__dirname, "fixtures", "sidi test - boots and cats_stems_sidi-vst-007.mid"));
    midi.tracks.flatten();

    const sampleRate = 44100;
    const samples = await renderMidiToPcm(midi, sampleRate);
    const onsets = await OnsetDetector.detect(samples, { sampleRate });

    // NB: Every hit in this fixture should land on a multiple of 250ms - anything off by 9ms or
    // more is a perceptible timing error (see OnsetDetector for why hits below hfc's sensitivity,
    // eg. low-frequency kicks, won't show up here at all - that's expected, not a failure).
    const gridMs = 250;
    const violations = onsets
      .map((time, index) => {
        const remainder = (time * 1000) % gridMs;
        const deviationMs = Math.min(remainder, gridMs - remainder);
        return { index, time, deviationMs };
      })
      .filter(({ deviationMs }) => deviationMs >= 9);

    console.log(`Detected ${onsets.length} onsets`);
    if (violations.length)
      console.log('Off-grid: ' + violations.map(v => `#${v.index} at ${v.time.toFixed(4)}s (${v.deviationMs.toFixed(2)}ms)`).join(', '));

    expect(violations).toEqual([]);
  }, 30000);

});
