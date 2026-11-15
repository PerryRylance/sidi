// NB: Messages the worklet posts to the main thread over AudioWorkletNode.port. Type-only, shared by the worklet
// and the helper, so it never ends up in either bundle.
export type SidiWorkletMessage =
    | { type: "ready" }
    | { type: "error"; message: string };
