//#region src/helper.ts
var PROCESSOR_NAME = "sidi-audio-worklet-processor";
function getWorkletUrl() {
	return new URL("./SidiAudioWorkletProcessor.js", import.meta.url);
}
var loaded = /* @__PURE__ */ new WeakMap();
function loadSidiWorklet(context, workletUrl = getWorkletUrl()) {
	const url = String(workletUrl);
	let byUrl = loaded.get(context);
	if (!byUrl) loaded.set(context, byUrl = /* @__PURE__ */ new Map());
	let promise = byUrl.get(url);
	if (!promise) {
		promise = context.audioWorklet.addModule(url);
		promise.catch(() => byUrl.delete(url));
		byUrl.set(url, promise);
	}
	return promise;
}
async function createSidiNode(context, midi, options = {}) {
	const { loop = false, workletUrl } = options;
	await loadSidiWorklet(context, workletUrl);
	const nodeOptions = { processorOptions: {
		midi,
		loop
	} };
	return new AudioWorkletNode(context, PROCESSOR_NAME, nodeOptions);
}
//#endregion
export { PROCESSOR_NAME, createSidiNode, getWorkletUrl, loadSidiWorklet };
