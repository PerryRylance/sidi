// NB: Public entry point for use outside an AudioWorklet (main thread, Node, tests, offline rendering).
// The worklet itself is a separate bundle (SidiAudioWorkletProcessor.js) loaded via audioWorklet.addModule().

export { default as Processor } from "./Processor";
export { default as SidChipAdapter } from "./SidChipAdapter";
export { default as ContinuousController } from "./ContinuousController";
export type { ContinuousControllerValue } from "./ContinuousController";
export * as ClockFrequencyHz from "./ClockFrequencyHz";

// NB: Needed to construct a SidChipAdapter (and therefore a Processor) - the WASM is bundled in.
export { default as createSIDModule } from "../compiled/libresidfp";
export type { SID, SIDModule } from "../compiled/libresidfp";
