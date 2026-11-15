//#region src/helper.d.ts
declare const PROCESSOR_NAME = "sidi-audio-worklet-processor";
interface CreateSidiNodeOptions {
  loop?: boolean;
  /** Override where the worklet script is loaded from (e.g. a file placed by `sidi-publish`). */
  workletUrl?: string | URL;
}
declare function getWorkletUrl(): URL;
declare function loadSidiWorklet(context: BaseAudioContext, workletUrl?: string | URL): Promise<void>;
declare function createSidiNode(context: BaseAudioContext, midi: ArrayBuffer, options?: CreateSidiNodeOptions): Promise<AudioWorkletNode>;
//#endregion
export { CreateSidiNodeOptions, PROCESSOR_NAME, createSidiNode, getWorkletUrl, loadSidiWorklet };