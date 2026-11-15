import { Event, File } from "@perry-rylance/midi";
//#endregion
//#region compiled/libresidfp.d.ts
declare enum ChipModel {
  MOS6581 = 0,
  CSG8580 = 1
}
declare enum CombinedWaveforms {
  AVERAGE = 0,
  WEAK = 1,
  STRONG = 2
}
declare enum SamplingMethod {
  DECIMATE = 0,
  RESAMPLE = 1,
  NONE = 2
}
declare class SID {
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
interface SIDModule {
  ChipModel: typeof ChipModel;
  CombinedWaveforms: typeof CombinedWaveforms;
  SamplingMethod: typeof SamplingMethod;
  SID: typeof SID;
}
declare const createSIDModule: (options?: any) => Promise<SIDModule>;
//#endregion
//#region src/MidiInterpreter.d.ts
declare class MidiInterpreter {
  private sid;
  private clockFrequencyHz;
  private pcmFrequencyHz;
  private attackDecay;
  private sustainRelease;
  private controlRegister;
  private controlRegisterDirty;
  private lastPressedKey;
  private filterResonanceSelect;
  private filterModeVolumeSelect;
  private adsrWorkaroundGlobalEnabled;
  private adsrWorkaroundChannelEnabled;
  private pendingAdsrRelease;
  private rpnMsb;
  private rpnLsb;
  private maxBendSemitones;
  private pitchBendAmount;
  constructor(sid: SID, clockFrequencyHz?: number, initialControlRegister?: number, initialSustainRelease?: number, initialFilterModeVolumeSelect?: number);
  private getExtrapolatedBitValue;
  private updateFrequency;
  private processNoteOn;
  private processPitchWheel;
  private processNoteOff;
  hasPendingAdsrRelease(channel: number): boolean;
  releaseAdsrHold(channel: number): void;
  isAdsrWorkaroundGlobalEnabled(): boolean;
  isAdsrWorkaroundEnabledForChannel(channel: number): boolean;
  private processController;
  flush(): void;
  process(event: Event): void;
}
//#endregion
//#region src/SidChipAdapter.d.ts
/**
 * NB: Mirrors sidi-vst's SidChipAdapter.cpp - the SID class is an
 * Emscripten/embind binding whose constructor rejects being invoked via
 * `super()` from a subclass ("Use 'new' to construct SID"), so real
 * inheritance isn't possible here either. This wraps an existing SID
 * instance, forwarding every call, and writes the same sensible power-on
 * defaults the C++ adapter writes (the real chip's registers otherwise
 * start zeroed, which leaves the master volume nibble in $18 muted until
 * something explicitly sends a Main Volume CC).
 */
declare class SidChipAdapter implements SID {
  private sid;
  static readonly DEFAULT_CONTROL_REGISTER = 32;
  static readonly DEFAULT_SUSTAIN_RELEASE = 240;
  static readonly DEFAULT_FILTER_MODE_VOLUME = 15;
  constructor(sid: SID);
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
//#endregion
//#region src/Processor.d.ts
declare class Processor {
  private sid;
  private midi;
  private sampleRate;
  private clockFrequencyHz;
  private static readonly holdDurationMs;
  private bpm;
  private buffer;
  private interpreter;
  private nextEventIndex;
  private accumulatedDeltaSamples;
  private idealElapsedSeconds;
  private roundedElapsedSamples;
  private currentEventTotalSamples;
  private readonly holdSamples;
  private releaseAtSample;
  private totalSamplesClocked;
  constructor(sid: SidChipAdapter, midi: File, sampleRate?: number, clockFrequencyHz?: number);
  getInterpreter(): MidiInterpreter;
  private getNumSamplesFromDelta;
  private clockAndWrite;
  private clockRespectingPendingReleases;
  process(buffer: Int16Array, size?: number, loop?: boolean): number;
}
//#endregion
//#region src/ContinuousController.d.ts
declare const ContinuousController: {
  readonly PulseWidth: 75;
  readonly Attack: 76;
  readonly Decay: 77;
  readonly Sustain: 78;
  readonly Release: 79;
  readonly Tri: 80;
  readonly Saw: 81;
  readonly Pulse: 82;
  readonly Noise: 83;
  readonly Gate: 84;
  readonly Sync: 85;
  readonly Ring: 86;
  readonly Test: 87;
  readonly FilterCutoff: 74;
  readonly FilterResonance: 71;
  readonly FilterEnable: 88;
  readonly FilterLowPass: 89;
  readonly FilterBandPass: 90;
  readonly FilterHighPass: 91;
  readonly Oscillator3Mute: 92;
  readonly AdsrWorkaroundGlobal: 93;
  readonly AdsrWorkaroundChannel: 94;
  readonly MainVolume: 7;
};
type ContinuousControllerValue = typeof ContinuousController[keyof typeof ContinuousController];
declare namespace ClockFrequencyHz_d_exports {
  export { Ntsc, Pal };
}
declare const Pal = 985248;
declare const Ntsc = 1022727;
//#endregion
export { ClockFrequencyHz_d_exports as ClockFrequencyHz, ContinuousController, type ContinuousControllerValue, Processor, type SID, type SIDModule, SidChipAdapter, createSIDModule };