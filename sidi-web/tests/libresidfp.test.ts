import { describe, test, expect, beforeAll } from 'vitest';
import createSIDModule from '../compiled/libresidfp';

describe('libresidfp WASM bindings', () => {
  let module: any;

  beforeAll(async () => {
    module = await createSIDModule({});
  });

  test('enums exist', () => {
    expect(module.ChipModel).toBeDefined();
    expect(module.CombinedWaveforms).toBeDefined();
    expect(module.SamplingMethod).toBeDefined();

    // Check enum values
    expect(module.ChipModel.MOS6581).toBeDefined();
    expect(module.ChipModel.CSG8580).toBeDefined();
    expect(module.CombinedWaveforms.AVERAGE).toBeDefined();
    expect(module.SamplingMethod.RESAMPLE).toBeDefined();
  });

  test('SID class exists', () => {
    expect(module.SID).toBeDefined();
  });

  test('SID class methods exist', () => {
    const sid = new module.SID();
    expect(sid).toBeDefined();

    // Verify all expected methods are present on the instance
    const expectedMethods = [
      'setChipModel',
      'getChipModel',
      'setCombinedWaveforms',
      'reset',
      'input',
      'read',
      'write',
      'setSamplingParameters',
      'clock',
      'clockSilent',
      'setFilter6581Curve',
      'setFilter6581Range',
      'setFilter8580Curve',
      'enableFilter',
      'enableOld6581caps',
    ];

    for (const method of expectedMethods) {
      expect(typeof sid[method]).toBe('function');
    }

    // Clean up
    sid.delete();
  });

  test('SID functionality works', () => {
    const sid = new module.SID();
    
    // Test some basic method calls
    sid.setChipModel(module.ChipModel.MOS6581);
    expect(sid.getChipModel()).toBe(module.ChipModel.MOS6581);

    sid.setChipModel(module.ChipModel.CSG8580);
    expect(sid.getChipModel()).toBe(module.ChipModel.CSG8580);

    sid.reset();
    sid.write(0, 0x12);
    // Write-only register read returns last written byte
    expect(sid.read(0)).toBe(0x12);

    sid.delete();
  });
});
