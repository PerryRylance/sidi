import { describe, test, expect, beforeAll } from 'vitest';
import fs from "fs";
import path from "path";
import { File } from "@perry-rylance/midi";
import createSIDModule from '../compiled/libresidfp';
import Driver from '../src/Driver';

describe('Driver Timing', () => {
  let module: any;

  beforeAll(async () => {
    module = await createSIDModule({});
  });

  test('process returns 88200 samples for one measure of silence', () => {
    const fixturePath = path.resolve(__dirname, 'fixtures/test-one-measure-silence.mid');
    const buffer = fs.readFileSync(fixturePath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    const file = File.fromArrayBuffer(arrayBuffer);

    expect(file.tracks.length).toBe(1);
    const track = file.tracks[0];

    const driver = new Driver(module, file.resolution);
    
    // Create a large enough buffer for the output samples
    const pcmBuffer = new Int16Array(88200);
    const result = driver.process(track, pcmBuffer);

    expect(result).toBe(88200);
  });
});
