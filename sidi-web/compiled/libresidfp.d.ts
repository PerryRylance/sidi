export enum ChipModel {
  MOS6581 = 0,
  CSG8580 = 1
}

export enum CombinedWaveforms {
  AVERAGE = 0,
  WEAK = 1,
  STRONG = 2
}

export enum SamplingMethod {
  DECIMATE = 0,
  RESAMPLE = 1,
  NONE = 2
}

export class SID {
  constructor();
  setChipModel(model: ChipModel): void;
  getChipModel(): ChipModel;
  setCombinedWaveforms(cws: CombinedWaveforms): void;
  reset(): void;
  input(value: number): void;
  read(offset: number): number;
  write(offset: number, value: number): void;
  setSamplingParameters(clockFrequency: number, method: SamplingMethod, samplingFrequency: number): void;
  clock(cycles: number, buf: Int16Array | number): number;
  clock(buf: Int16Array | number, bufSize: number): number;
  clockSilent(cycles: number): void;
  setFilter6581Curve(filterCurve: number): void;
  setFilter6581Range(adjustment: number): void;
  setFilter8580Curve(filterCurve: number): void;
  enableFilter(enable: boolean): void;
  enableOld6581caps(enable: boolean): void;
  delete(): void;
}

export interface SIDModule {
  ChipModel: typeof ChipModel;
  CombinedWaveforms: typeof CombinedWaveforms;
  SamplingMethod: typeof SamplingMethod;
  SID: typeof SID;
}

declare const createSIDModule: (options?: any) => Promise<SIDModule>;
export default createSIDModule;
export { createSIDModule as Module };
