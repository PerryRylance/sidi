import { describe, test, expect, vi } from 'vitest';
import { File, Track } from "@perry-rylance/midi";
import Processor from '../src/Processor';
import MidiInterpreter from '../src/MidiInterpreter';
import SidChipAdapter from '../src/SidChipAdapter';
import FakeSid from './support/FakeSid';

function createAdapter()
{
  const fake = new FakeSid();
  const spy = vi.spyOn(fake, 'setSamplingParameters');
  return { sid: new SidChipAdapter(fake as any), spy };
}

function createFile()
{
  const file = new File();
  file.tracks.push(new Track());
  return file;
}

describe('sampling parameters', () => {
  test.each([44100, 48000, 96000])('Processor passes a sample rate of %i down to setSamplingParameters', (sampleRate) => {
    const { sid, spy } = createAdapter();
    new Processor(sid, createFile(), sampleRate);

    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0] as unknown[])[2]).toBe(sampleRate);
  });

  test('Processor defaults to 44100', () => {
    const { sid, spy } = createAdapter();
    new Processor(sid, createFile());

    expect((spy.mock.calls[0] as unknown[])[2]).toBe(44100);
  });

  test('MidiInterpreter passes its sample rate down to setSamplingParameters', () => {
    const { sid, spy } = createAdapter();
    new MidiInterpreter(sid, undefined, 0, 0, 0, 48000);

    expect((spy.mock.calls[0] as unknown[])[2]).toBe(48000);
  });
});
