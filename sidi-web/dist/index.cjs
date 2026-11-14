Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/DeviceManufacturer.js
var require_DeviceManufacturer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var DeviceManufacturer;
	(function(DeviceManufacturer) {
		DeviceManufacturer[DeviceManufacturer["SEQUENTIAL_CIRCUITS"] = 1] = "SEQUENTIAL_CIRCUITS";
		DeviceManufacturer[DeviceManufacturer["BIG_BRIAR"] = 2] = "BIG_BRIAR";
		DeviceManufacturer[DeviceManufacturer["OCTAVE_PLATEAU"] = 3] = "OCTAVE_PLATEAU";
		DeviceManufacturer[DeviceManufacturer["MOOG"] = 4] = "MOOG";
		DeviceManufacturer[DeviceManufacturer["PASSPORT_DESIGNS"] = 5] = "PASSPORT_DESIGNS";
		DeviceManufacturer[DeviceManufacturer["LEXICON"] = 6] = "LEXICON";
		DeviceManufacturer[DeviceManufacturer["KURZWEIL"] = 7] = "KURZWEIL";
		DeviceManufacturer[DeviceManufacturer["FENDER"] = 8] = "FENDER";
		DeviceManufacturer[DeviceManufacturer["GULBRANSEN"] = 9] = "GULBRANSEN";
		DeviceManufacturer[DeviceManufacturer["DELTA_LABS"] = 10] = "DELTA_LABS";
		DeviceManufacturer[DeviceManufacturer["SOUND_COMP"] = 11] = "SOUND_COMP";
		DeviceManufacturer[DeviceManufacturer["GENERAL_ELECTRO"] = 12] = "GENERAL_ELECTRO";
		DeviceManufacturer[DeviceManufacturer["TECHMAR"] = 13] = "TECHMAR";
		DeviceManufacturer[DeviceManufacturer["MATTHEWS_RESEARCH"] = 14] = "MATTHEWS_RESEARCH";
		DeviceManufacturer[DeviceManufacturer["OBERHEIM"] = 16] = "OBERHEIM";
		DeviceManufacturer[DeviceManufacturer["PAIA"] = 17] = "PAIA";
		DeviceManufacturer[DeviceManufacturer["SIMMONS"] = 18] = "SIMMONS";
		DeviceManufacturer[DeviceManufacturer["GENTLE_ELECTRIC"] = 19] = "GENTLE_ELECTRIC";
		DeviceManufacturer[DeviceManufacturer["FAIRLIGHT"] = 20] = "FAIRLIGHT";
		DeviceManufacturer[DeviceManufacturer["JL_COOPER"] = 21] = "JL_COOPER";
		DeviceManufacturer[DeviceManufacturer["LOWERY"] = 22] = "LOWERY";
		DeviceManufacturer[DeviceManufacturer["LIN"] = 23] = "LIN";
		DeviceManufacturer[DeviceManufacturer["EMU"] = 24] = "EMU";
		DeviceManufacturer[DeviceManufacturer["PEAVEY"] = 27] = "PEAVEY";
		DeviceManufacturer[DeviceManufacturer["BON_TEMPI"] = 32] = "BON_TEMPI";
		DeviceManufacturer[DeviceManufacturer["SIEL"] = 33] = "SIEL";
		DeviceManufacturer[DeviceManufacturer["SYNTHEAXE"] = 35] = "SYNTHEAXE";
		DeviceManufacturer[DeviceManufacturer["HOHNER"] = 36] = "HOHNER";
		DeviceManufacturer[DeviceManufacturer["CRUMAR"] = 37] = "CRUMAR";
		DeviceManufacturer[DeviceManufacturer["SOLTON"] = 38] = "SOLTON";
		DeviceManufacturer[DeviceManufacturer["JELLINGHOUS_MS"] = 39] = "JELLINGHOUS_MS";
		DeviceManufacturer[DeviceManufacturer["CTS"] = 40] = "CTS";
		DeviceManufacturer[DeviceManufacturer["PPG"] = 41] = "PPG";
		DeviceManufacturer[DeviceManufacturer["ELKA"] = 47] = "ELKA";
		DeviceManufacturer[DeviceManufacturer["KAWAI"] = 64] = "KAWAI";
		DeviceManufacturer[DeviceManufacturer["ROLAND"] = 65] = "ROLAND";
		DeviceManufacturer[DeviceManufacturer["KORG"] = 66] = "KORG";
		DeviceManufacturer[DeviceManufacturer["YAMAHA"] = 67] = "YAMAHA";
		DeviceManufacturer[DeviceManufacturer["CASIO"] = 68] = "CASIO";
		DeviceManufacturer[DeviceManufacturer["AKAI"] = 69] = "AKAI";
	})(DeviceManufacturer || (DeviceManufacturer = {}));
	exports.default = DeviceManufacturer;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/streams/Stream.js
var require_Stream = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var Stream = class {
		constructor() {
			this.position = 0;
		}
		getPosition() {
			return this.position;
		}
	};
	exports.default = Stream;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/exceptions/ParseError.js
var require_ParseError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ParseError = class extends Error {
		constructor(stream, message) {
			super(`${message} near stream position 0x${stream.getPosition().toString(16)}`);
		}
	};
	exports.default = ParseError;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/streams/ReadStream.js
var require_ReadStream = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Stream_1 = __importDefault(require_Stream());
	var ParseError_1 = __importDefault(require_ParseError());
	var ReadStream = class extends Stream_1.default {
		constructor(buffer) {
			super();
			this.dataView = new DataView(buffer);
		}
		getLength() {
			return this.dataView.byteLength;
		}
		readByte() {
			if (this.position >= this.dataView.byteLength) throw new ParseError_1.default(this, "Unexpected end of stream");
			const result = this.dataView.getUint8(this.position);
			this.position++;
			return result;
		}
		readSignedByte() {
			if (this.position >= this.dataView.byteLength) throw new ParseError_1.default(this, "Unexpected end of stream");
			const result = this.dataView.getInt8(this.position);
			this.position++;
			return result;
		}
		readShort() {
			if (this.position >= this.dataView.byteLength - 1) throw new ParseError_1.default(this, "Unexpected end of stream");
			const result = this.dataView.getUint16(this.position);
			this.position += 2;
			return result;
		}
		readUint() {
			if (this.position >= this.dataView.byteLength - 3) throw new ParseError_1.default(this, "Unexpected end of stream");
			const result = this.dataView.getUint32(this.position);
			this.position += 4;
			return result;
		}
		readVLV() {
			let value, c;
			try {
				if ((value = this.readByte()) & 128) {
					value &= 127;
					do
						value = (value << 7) + ((c = this.readByte()) & 127);
					while (c & 128);
				}
			} catch (e) {
				if (e instanceof RangeError) throw new ParseError_1.default(this, "Unexpected end of stream");
				throw e;
			}
			return value;
		}
		assertPositionValid() {
			if (this.position >= 0 && this.position < this.dataView.byteLength) return;
			throw new RangeError("Invalid stream position");
		}
		seekRelative(relative) {
			this.position += relative;
			if (this.position < 0 || this.position >= this.dataView.byteLength) throw new RangeError("Seeked out of bounds");
			this.assertPositionValid();
		}
	};
	exports.default = ReadStream;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/CallableProperty.js
var require_CallableProperty = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createCallableStringAccessor = exports.createCallableAccessor = exports.defineCallableProperty = void 0;
	/**
	* Defines a callable property on `prototype` (call once per class, not per instance).
	* The callable itself is a single function shared by every instance via the prototype
	* chain - the only per-instance cost is a WeakMap entry, created lazily the first time
	* the property is read or written, so this scales to large instance counts without
	* allocating a Proxy (or anything else) per instance.
	*/
	function defineCallableProperty(prototype, key, initial) {
		const store = /* @__PURE__ */ new WeakMap();
		Object.defineProperty(prototype, key, {
			value: function(...args) {
				if (args.length === 0) return store.has(this) ? store.get(this) : initial;
				store.set(this, args[0]);
				return this;
			},
			enumerable: false,
			configurable: false,
			writable: false
		});
	}
	exports.defineCallableProperty = defineCallableProperty;
	/**
	* Wraps an existing get/set pair in a callable+coercible accessor: calling it with an
	* argument sets the value via `set` and returns `owner` for chaining, calling it with no
	* arguments (or coercing it, e.g. in arithmetic) reads the value via `get`. Intended to be
	* memoized per instance by the caller (one per instance, not one per access), so an
	* existing accessor can grow a callable form without a Proxy and without giving up its
	* plain get/set for compatibility.
	*/
	function createCallableAccessor(owner, get, set) {
		const callable = ((...args) => {
			if (args.length === 0) return get();
			set(args[0]);
			return owner;
		});
		callable.valueOf = get;
		callable[Symbol.toPrimitive] = get;
		return callable;
	}
	exports.createCallableAccessor = createCallableAccessor;
	/**
	* Same contract as createCallableAccessor, but for string-valued properties that are used
	* via string methods/properties directly (e.g. `.length`, `.charCodeAt(i)`) rather than only
	* via coercion in an operator. valueOf/Symbol.toPrimitive alone (as createCallableAccessor
	* uses) don't cover `.length` et al - a bare function has its own (wrong) `.length`, and none
	* of String.prototype's methods - so this delegates every property/method access to a fresh
	* boxed String reflecting the current value, via a Proxy (heavier than createCallableAccessor,
	* but text-like meta events are comparatively rare compared to note/controller events).
	*/
	function createCallableStringAccessor(owner, get, set) {
		return new Proxy(() => {}, {
			apply(_target, _thisArg, args) {
				if (args.length === 0) return get();
				set(args[0]);
				return owner;
			},
			get(_target, prop, receiver) {
				const boxed = new String(get());
				const value = Reflect.get(boxed, prop, receiver);
				return typeof value === "function" ? value.bind(boxed) : value;
			}
		});
	}
	exports.createCallableStringAccessor = createCallableStringAccessor;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/Probeable.js
var require_Probeable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var Probeable = class {
		probe(condition) {
			if (condition && condition()) debugger;
			return this;
		}
	};
	exports.default = Probeable;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/Event.js
var require_Event = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EventType = void 0;
	var CallableProperty_1 = require_CallableProperty();
	var Probeable_1 = __importDefault(require_Probeable());
	var EventType;
	(function(EventType) {
		EventType[EventType["CONTROL"] = 0] = "CONTROL";
		EventType[EventType["SYSEX"] = 240] = "SYSEX";
		EventType[EventType["META"] = 255] = "META";
	})(EventType || (exports.EventType = EventType = {}));
	var Event = class extends Probeable_1.default {
		constructor(delta = 0) {
			super();
			this._delta = 0;
			this.delta = delta;
		}
		get delta() {
			var _a;
			return (_a = this._deltaAccessor) !== null && _a !== void 0 ? _a : this._deltaAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._delta, (value) => {
				this.delta = value;
			});
		}
		set delta(value) {
			this.assertValidDelta(value);
			this._delta = value;
		}
		writeBytes(stream, status) {
			this.writeType(stream, status);
		}
		assertPositiveInteger(value) {
			if (value < 0) throw new RangeError("Value cannot be negative");
			if (!Number.isInteger(value)) throw new TypeError("Value must be an integer");
		}
		assertValidDelta(value) {
			this.assertValidVlv(value);
		}
		assertValidChannel(channel) {
			this.assertUnsignedAndBelow(channel, 15);
		}
		assertUnsignedAndBelow(value, max) {
			this.assertPositiveInteger(value);
			if (value > max) throw new RangeError("Value too large");
		}
		assertNonZero(value) {
			if (value === 0) throw new RangeError("Value must be non-zero");
		}
		assertValidByte(value) {
			this.assertUnsignedAndBelow(value, 255);
		}
		assertValidShort(value) {
			this.assertUnsignedAndBelow(value, 65535);
		}
		assertValidUint(value) {
			this.assertUnsignedAndBelow(value, 4294967295);
		}
		assertValidVlv(value) {
			this.assertUnsignedAndBelow(value, 268435455);
		}
	};
	exports.default = Event;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/MetaEvent.js
var require_MetaEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MetaEventType = void 0;
	var ParseError_1 = __importDefault(require_ParseError());
	var Event_1 = __importStar(require_Event());
	var MetaEventType;
	(function(MetaEventType) {
		MetaEventType[MetaEventType["SEQUENCE_NUMBER"] = 0] = "SEQUENCE_NUMBER";
		MetaEventType[MetaEventType["TEXT"] = 1] = "TEXT";
		MetaEventType[MetaEventType["COPYRIGHT"] = 2] = "COPYRIGHT";
		MetaEventType[MetaEventType["TRACK_NAME"] = 3] = "TRACK_NAME";
		MetaEventType[MetaEventType["INSTRUMENT_NAME"] = 4] = "INSTRUMENT_NAME";
		MetaEventType[MetaEventType["LYRIC"] = 5] = "LYRIC";
		MetaEventType[MetaEventType["MARKER"] = 6] = "MARKER";
		MetaEventType[MetaEventType["CUE_POINT"] = 7] = "CUE_POINT";
		MetaEventType[MetaEventType["CHANNEL_PREFIX"] = 32] = "CHANNEL_PREFIX";
		MetaEventType[MetaEventType["PORT_PREFIX"] = 33] = "PORT_PREFIX";
		MetaEventType[MetaEventType["END_OF_TRACK"] = 47] = "END_OF_TRACK";
		MetaEventType[MetaEventType["SET_TEMPO"] = 81] = "SET_TEMPO";
		MetaEventType[MetaEventType["SMPTE_OFFSET"] = 84] = "SMPTE_OFFSET";
		MetaEventType[MetaEventType["TIME_SIGNATURE"] = 88] = "TIME_SIGNATURE";
		MetaEventType[MetaEventType["KEY_SIGNATURE"] = 89] = "KEY_SIGNATURE";
		MetaEventType[MetaEventType["SEQUENCER_SPECIFIC"] = 127] = "SEQUENCER_SPECIFIC";
	})(MetaEventType || (exports.MetaEventType = MetaEventType = {}));
	var MetaEvent = class extends Event_1.default {
		assertByteLength(stream, actual, expected) {
			if (actual !== expected) throw new ParseError_1.default(stream, `Expected length to be ${expected} bytes`);
		}
		writeType(stream) {
			stream.writeByte(Event_1.EventType.META);
			stream.writeByte(this.getMetaType());
		}
	};
	exports.default = MetaEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/TextEvent.js
var require_TextEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var CallableProperty_1 = require_CallableProperty();
	var TextEvent = class extends MetaEvent_1.default {
		constructor() {
			super(...arguments);
			this._text = "";
		}
		get text() {
			var _a;
			return (_a = this._textAccessor) !== null && _a !== void 0 ? _a : this._textAccessor = (0, CallableProperty_1.createCallableStringAccessor)(this, () => this._text, (value) => {
				this.text = value;
			});
		}
		set text(value) {
			this.assertValidText(value);
			this._text = value;
		}
		readBytes(stream) {
			const length = stream.readVLV();
			for (let i = 0; i < length; i++) this.text += String.fromCharCode(stream.readByte());
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeVLV(this.text.length);
			for (let i = 0; i < this.text.length; i++) stream.writeByte(this.text.charCodeAt(i));
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.TEXT;
		}
		assertValidText(value) {
			if (value.length > 268435455) throw new RangeError("Text too long");
			if (!/^[\x00-\xFF]*$/.test(value)) throw new RangeError("One or more characters are not valid ASCII");
		}
	};
	exports.default = TextEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/SetTempoEvent.js
var require_SetTempoEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var CallableProperty_1 = require_CallableProperty();
	var MICROSECONDS_PER_MINUTE = 6e7;
	var SetTempoEvent = class extends MetaEvent_1.default {
		constructor() {
			super(...arguments);
			this.mspqn = 120 * MICROSECONDS_PER_MINUTE;
		}
		get bpm() {
			var _a;
			return (_a = this._bpmAccessor) !== null && _a !== void 0 ? _a : this._bpmAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => MICROSECONDS_PER_MINUTE / this.mspqn, (value) => {
				this.bpm = value;
			});
		}
		set bpm(value) {
			const mspqn = Math.round(MICROSECONDS_PER_MINUTE / value);
			this.assertNonZero(mspqn);
			if (mspqn > 16777215) throw new RangeError("Microseconds-per-quarter-note exceeds maximum");
			this.mspqn = mspqn;
		}
		readBytes(stream) {
			this.assertByteLength(stream, stream.readByte(), 3);
			const a = stream.readByte() & 255;
			const b = stream.readByte() & 255;
			const c = stream.readByte() & 255;
			this.mspqn = a << 16 | b << 8 | c;
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(3);
			stream.writeByte(this.mspqn >> 16 & 255);
			stream.writeByte(this.mspqn >> 8 & 255);
			stream.writeByte(this.mspqn & 255);
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.SET_TEMPO;
		}
	};
	exports.default = SetTempoEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/FrameRate.js
var require_FrameRate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FrameRate = void 0;
	var FrameRate;
	(function(FrameRate) {
		FrameRate[FrameRate["FPS_24"] = 0] = "FPS_24";
		FrameRate[FrameRate["FPS_25"] = 1] = "FPS_25";
		FrameRate[FrameRate["FPS_DROP_30"] = 2] = "FPS_DROP_30";
		FrameRate[FrameRate["FPS_30"] = 3] = "FPS_30";
	})(FrameRate || (exports.FrameRate = FrameRate = {}));
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/SmtpeOffsetEvent.js
var require_SmtpeOffsetEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ParseError_1 = __importDefault(require_ParseError());
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var FrameRate_1 = require_FrameRate();
	var CallableProperty_1 = require_CallableProperty();
	var SmtpeOffsetEvent = class extends MetaEvent_1.default {
		constructor() {
			super(...arguments);
			this._rate = FrameRate_1.FrameRate.FPS_24;
			this._hours = 1;
			this._minutes = 0;
			this._seconds = 0;
			this._frames = 0;
			this._subframes = 0;
		}
		get rate() {
			var _a;
			return (_a = this._rateAccessor) !== null && _a !== void 0 ? _a : this._rateAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._rate, (value) => {
				this.rate = value;
			});
		}
		set rate(value) {
			this._rate = value;
		}
		get hours() {
			var _a;
			return (_a = this._hoursAccessor) !== null && _a !== void 0 ? _a : this._hoursAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._hours, (value) => {
				this.hours = value;
			});
		}
		set hours(value) {
			this._hours = value;
		}
		get minutes() {
			var _a;
			return (_a = this._minutesAccessor) !== null && _a !== void 0 ? _a : this._minutesAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._minutes, (value) => {
				this.minutes = value;
			});
		}
		set minutes(value) {
			this._minutes = value;
		}
		get seconds() {
			var _a;
			return (_a = this._secondsAccessor) !== null && _a !== void 0 ? _a : this._secondsAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._seconds, (value) => {
				this.seconds = value;
			});
		}
		set seconds(value) {
			this._seconds = value;
		}
		get frames() {
			var _a;
			return (_a = this._framesAccessor) !== null && _a !== void 0 ? _a : this._framesAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._frames, (value) => {
				this.frames = value;
			});
		}
		set frames(value) {
			this._frames = value;
		}
		get subframes() {
			var _a;
			return (_a = this._subframesAccessor) !== null && _a !== void 0 ? _a : this._subframesAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._subframes, (value) => {
				this.subframes = value;
			});
		}
		set subframes(value) {
			this._subframes = value;
		}
		readBytes(stream) {
			this.assertByteLength(stream, stream.readByte(), 5);
			const byte = stream.readByte();
			this.rate = (byte & 96) >> 5;
			this.hours = byte & 31;
			if (!(this.rate in FrameRate_1.FrameRate)) throw new ParseError_1.default(stream, "Invalid SMTPE rate");
			this.minutes = stream.readByte();
			this.seconds = stream.readByte();
			this.frames = stream.readByte();
			this.subframes = stream.readByte();
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(5);
			stream.writeByte(this.rate << 5 & 96 | this.hours & 31);
			stream.writeByte(this.minutes);
			stream.writeByte(this.seconds);
			stream.writeByte(this.frames);
			stream.writeByte(this.subframes);
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.SMPTE_OFFSET;
		}
	};
	exports.default = SmtpeOffsetEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/SequenceNumberEvent.js
var require_SequenceNumberEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var CallableProperty_1 = require_CallableProperty();
	var SequenceNumberEvent = class extends MetaEvent_1.default {
		constructor() {
			super(...arguments);
			this._number = 0;
		}
		get number() {
			var _a;
			return (_a = this._numberAccessor) !== null && _a !== void 0 ? _a : this._numberAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._number, (value) => {
				this.number = value;
			});
		}
		set number(value) {
			this.assertValidShort(value);
			this._number = value;
		}
		readBytes(stream) {
			this.assertByteLength(stream, stream.readByte(), 2);
			this.number = stream.readShort();
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(2);
			stream.writeShort(this.number);
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.SEQUENCE_NUMBER;
		}
	};
	exports.default = SequenceNumberEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/EndOfTrackEvent.js
var require_EndOfTrackEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var EndOfTrackEvent = class extends MetaEvent_1.default {
		readBytes(stream) {
			this.assertByteLength(stream, stream.readByte(), 0);
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(0);
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.END_OF_TRACK;
		}
	};
	exports.default = EndOfTrackEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/ChannelPrefixEvent.js
var require_ChannelPrefixEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var CallableProperty_1 = require_CallableProperty();
	var ChannelPrefixEvent = class extends MetaEvent_1.default {
		constructor() {
			super(...arguments);
			this._channel = 0;
		}
		get channel() {
			var _a;
			return (_a = this._channelAccessor) !== null && _a !== void 0 ? _a : this._channelAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._channel, (value) => {
				this.channel = value;
			});
		}
		set channel(value) {
			this.assertValidChannel(value);
			this._channel = value;
		}
		readBytes(stream) {
			this.assertByteLength(stream, stream.readByte(), 1);
			this.channel = stream.readByte();
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(1);
			stream.writeByte(this.channel);
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.CHANNEL_PREFIX;
		}
	};
	exports.default = ChannelPrefixEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/PortPrefixEvent.js
var require_PortPrefixEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var CallableProperty_1 = require_CallableProperty();
	var PortPrefixEvent = class extends MetaEvent_1.default {
		constructor() {
			super(...arguments);
			this._port = 0;
		}
		readBytes(stream) {
			this.assertByteLength(stream, stream.readByte(), 1);
			this.port = stream.readByte();
		}
		get port() {
			var _a;
			return (_a = this._portAccessor) !== null && _a !== void 0 ? _a : this._portAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._port, (value) => {
				this.port = value;
			});
		}
		set port(value) {
			this.assertValidByte(value);
			this._port = value;
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(1);
			stream.writeByte(this.port);
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.PORT_PREFIX;
		}
	};
	exports.default = PortPrefixEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/SequencerSpecificEvent.js
var require_SequencerSpecificEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var DeviceManufacturer_1 = __importDefault(require_DeviceManufacturer());
	var CallableProperty_1 = require_CallableProperty();
	var SequencerSpecificEvent = class extends MetaEvent_1.default {
		constructor() {
			super(...arguments);
			this._manufacturer = DeviceManufacturer_1.default.AKAI;
			this.bytes = new Uint8Array();
		}
		get manufacturer() {
			var _a;
			return (_a = this._manufacturerAccessor) !== null && _a !== void 0 ? _a : this._manufacturerAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._manufacturer, (value) => {
				this.manufacturer = value;
			});
		}
		set manufacturer(value) {
			this._manufacturer = value;
		}
		readBytes(stream) {
			const length = stream.readByte();
			this.manufacturer = stream.readByte();
			this.bytes = new Uint8Array(length - 1);
			for (let i = 1; i < length; i++) this.bytes[i] = stream.readByte();
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(this.bytes.length + 1);
			stream.writeByte(this.manufacturer);
			for (let i = 0; i < this.bytes.length; i++) stream.writeByte(this.bytes[i]);
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.SEQUENCER_SPECIFIC;
		}
	};
	exports.default = SequencerSpecificEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/CopyrightEvent.js
var require_CopyrightEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = require_MetaEvent();
	var TextEvent_1 = __importDefault(require_TextEvent());
	var CopyrightEvent = class extends TextEvent_1.default {
		getMetaType() {
			return MetaEvent_1.MetaEventType.COPYRIGHT;
		}
	};
	exports.default = CopyrightEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/TrackNameEvent.js
var require_TrackNameEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = require_MetaEvent();
	var TextEvent_1 = __importDefault(require_TextEvent());
	var TrackNameEvent = class extends TextEvent_1.default {
		getMetaType() {
			return MetaEvent_1.MetaEventType.TRACK_NAME;
		}
	};
	exports.default = TrackNameEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/InstrumentNameEvent.js
var require_InstrumentNameEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = require_MetaEvent();
	var TextEvent_1 = __importDefault(require_TextEvent());
	var InstrumentNameEvent = class extends TextEvent_1.default {
		getMetaType() {
			return MetaEvent_1.MetaEventType.INSTRUMENT_NAME;
		}
	};
	exports.default = InstrumentNameEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/LyricEvent.js
var require_LyricEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = require_MetaEvent();
	var TextEvent_1 = __importDefault(require_TextEvent());
	var LyricEvent = class extends TextEvent_1.default {
		getMetaType() {
			return MetaEvent_1.MetaEventType.LYRIC;
		}
	};
	exports.default = LyricEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/MarkerEvent.js
var require_MarkerEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = require_MetaEvent();
	var TextEvent_1 = __importDefault(require_TextEvent());
	var MarkerEvent = class extends TextEvent_1.default {
		getMetaType() {
			return MetaEvent_1.MetaEventType.MARKER;
		}
	};
	exports.default = MarkerEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/CuePointEvent.js
var require_CuePointEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = require_MetaEvent();
	var TextEvent_1 = __importDefault(require_TextEvent());
	var CuePointEvent = class extends TextEvent_1.default {
		getMetaType() {
			return MetaEvent_1.MetaEventType.CUE_POINT;
		}
	};
	exports.default = CuePointEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/TimeSignatureEvent.js
var require_TimeSignatureEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var CallableProperty_1 = require_CallableProperty();
	var TimeSignatureEvent = class extends MetaEvent_1.default {
		constructor() {
			super(...arguments);
			this._numerator = 4;
			this._denominator = 4;
			this._ticksPerMetronomeClick = 24;
			this._num32ndNotesPerBeat = 8;
		}
		get numerator() {
			var _a;
			return (_a = this._numeratorAccessor) !== null && _a !== void 0 ? _a : this._numeratorAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._numerator, (value) => {
				this.numerator = value;
			});
		}
		set numerator(value) {
			this.assertUnsignedAndBelow(value, 255);
			this.assertNonZero(value);
			this._numerator = value;
		}
		get denominator() {
			var _a;
			return (_a = this._denominatorAccessor) !== null && _a !== void 0 ? _a : this._denominatorAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._denominator, (value) => {
				this.denominator = value;
			});
		}
		set denominator(value) {
			this.assertPositiveInteger(value);
			if (Math.log2(value) % 1 !== 0) throw new Error("Denominator must be a power of two");
			this._denominator = value;
		}
		get ticksPerMetronomeClick() {
			var _a;
			return (_a = this._ticksPerMetronomeClickAccessor) !== null && _a !== void 0 ? _a : this._ticksPerMetronomeClickAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._ticksPerMetronomeClick, (value) => {
				this.ticksPerMetronomeClick = value;
			});
		}
		set ticksPerMetronomeClick(value) {
			this.assertUnsignedAndBelow(value, 255);
			this.assertNonZero(value);
			this._ticksPerMetronomeClick = value;
		}
		get num32ndNotesPerBeat() {
			var _a;
			return (_a = this._num32ndNotesPerBeatAccessor) !== null && _a !== void 0 ? _a : this._num32ndNotesPerBeatAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._num32ndNotesPerBeat, (value) => {
				this.num32ndNotesPerBeat = value;
			});
		}
		set num32ndNotesPerBeat(value) {
			this.assertUnsignedAndBelow(value, 255);
			this.assertNonZero(value);
			this._num32ndNotesPerBeat = value;
		}
		readBytes(stream) {
			this.assertByteLength(stream, stream.readByte(), 4);
			this.numerator = stream.readByte();
			this.denominator = Math.pow(2, stream.readByte());
			this.ticksPerMetronomeClick = stream.readByte();
			this.num32ndNotesPerBeat = stream.readByte();
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(4);
			stream.writeByte(this.numerator);
			stream.writeByte(Math.log2(this.denominator));
			stream.writeByte(this.ticksPerMetronomeClick);
			stream.writeByte(this.num32ndNotesPerBeat);
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.TIME_SIGNATURE;
		}
	};
	exports.default = TimeSignatureEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/meta/KeySignatureEvent.js
var require_KeySignatureEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Quality = void 0;
	var MetaEvent_1 = __importStar(require_MetaEvent());
	var CallableProperty_1 = require_CallableProperty();
	var Quality;
	(function(Quality) {
		Quality[Quality["MAJOR"] = 0] = "MAJOR";
		Quality[Quality["MINOR"] = 1] = "MINOR";
	})(Quality || (exports.Quality = Quality = {}));
	var KeySignatureEvent = class extends MetaEvent_1.default {
		constructor() {
			super(...arguments);
			this._accidentals = 0;
			this._quality = Quality.MAJOR;
		}
		get quality() {
			var _a;
			return (_a = this._qualityAccessor) !== null && _a !== void 0 ? _a : this._qualityAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._quality, (value) => {
				this.quality = value;
			});
		}
		set quality(value) {
			this._quality = value;
		}
		readBytes(stream) {
			this.assertByteLength(stream, stream.readByte(), 2);
			this.accidentals = stream.readSignedByte();
			this.quality = stream.readByte();
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(2);
			stream.writeSignedByte(this.accidentals);
			stream.writeByte(this.quality);
		}
		getMetaType() {
			return MetaEvent_1.MetaEventType.KEY_SIGNATURE;
		}
		get accidentals() {
			var _a;
			return (_a = this._accidentalsAccessor) !== null && _a !== void 0 ? _a : this._accidentalsAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._accidentals, (value) => {
				this.accidentals = value;
			});
		}
		set accidentals(value) {
			if (value < -7 || value > 7) throw new RangeError("Key signature accidentals out of range");
			this._accidentals = value;
		}
	};
	exports.default = KeySignatureEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/factories/MetaEventFactory.js
var require_MetaEventFactory = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var MetaEvent_1 = require_MetaEvent();
	var TextEvent_1 = __importDefault(require_TextEvent());
	var SetTempoEvent_1 = __importDefault(require_SetTempoEvent());
	var SmtpeOffsetEvent_1 = __importDefault(require_SmtpeOffsetEvent());
	var SequenceNumberEvent_1 = __importDefault(require_SequenceNumberEvent());
	var EndOfTrackEvent_1 = __importDefault(require_EndOfTrackEvent());
	var ChannelPrefixEvent_1 = __importDefault(require_ChannelPrefixEvent());
	var PortPrefixEvent_1 = __importDefault(require_PortPrefixEvent());
	var SequencerSpecificEvent_1 = __importDefault(require_SequencerSpecificEvent());
	var CopyrightEvent_1 = __importDefault(require_CopyrightEvent());
	var TrackNameEvent_1 = __importDefault(require_TrackNameEvent());
	var InstrumentNameEvent_1 = __importDefault(require_InstrumentNameEvent());
	var LyricEvent_1 = __importDefault(require_LyricEvent());
	var MarkerEvent_1 = __importDefault(require_MarkerEvent());
	var CuePointEvent_1 = __importDefault(require_CuePointEvent());
	var ParseError_1 = __importDefault(require_ParseError());
	var TimeSignatureEvent_1 = __importDefault(require_TimeSignatureEvent());
	var KeySignatureEvent_1 = __importDefault(require_KeySignatureEvent());
	var MetaEventFactory = class {
		static fromStream(stream, delta) {
			const type = stream.readByte();
			let result;
			switch (type) {
				case MetaEvent_1.MetaEventType.SEQUENCE_NUMBER:
					result = new SequenceNumberEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.TEXT:
					result = new TextEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.COPYRIGHT:
					result = new CopyrightEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.TRACK_NAME:
					result = new TrackNameEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.INSTRUMENT_NAME:
					result = new InstrumentNameEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.LYRIC:
					result = new LyricEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.MARKER:
					result = new MarkerEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.CUE_POINT:
					result = new CuePointEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.CHANNEL_PREFIX:
					result = new ChannelPrefixEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.PORT_PREFIX:
					result = new PortPrefixEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.END_OF_TRACK:
					result = new EndOfTrackEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.SET_TEMPO:
					result = new SetTempoEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.SMPTE_OFFSET:
					result = new SmtpeOffsetEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.TIME_SIGNATURE:
					result = new TimeSignatureEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.KEY_SIGNATURE:
					result = new KeySignatureEvent_1.default(delta);
					break;
				case MetaEvent_1.MetaEventType.SEQUENCER_SPECIFIC:
					result = new SequencerSpecificEvent_1.default(delta);
					break;
				default: throw new ParseError_1.default(stream, "Invalid meta event type 0x" + type.toString(16));
			}
			result.readBytes(stream);
			return result;
		}
	};
	exports.default = MetaEventFactory;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/control/ControlEvent.js
var require_ControlEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ControlEventType = void 0;
	var Event_1 = __importDefault(require_Event());
	var CallableProperty_1 = require_CallableProperty();
	var ControlEventType;
	(function(ControlEventType) {
		ControlEventType[ControlEventType["NOTE_OFF"] = 128] = "NOTE_OFF";
		ControlEventType[ControlEventType["NOTE_ON"] = 144] = "NOTE_ON";
		ControlEventType[ControlEventType["AFTERTOUCH"] = 160] = "AFTERTOUCH";
		ControlEventType[ControlEventType["KEY_PRESSURE"] = 160] = "KEY_PRESSURE";
		ControlEventType[ControlEventType["CONTROLLER"] = 176] = "CONTROLLER";
		ControlEventType[ControlEventType["PROGRAM_CHANGE"] = 192] = "PROGRAM_CHANGE";
		ControlEventType[ControlEventType["CHANNEL_AFTERTOUCH"] = 208] = "CHANNEL_AFTERTOUCH";
		ControlEventType[ControlEventType["CHANNEL_PRESSURE"] = 208] = "CHANNEL_PRESSURE";
		ControlEventType[ControlEventType["PITCH_WHEEL"] = 224] = "PITCH_WHEEL";
	})(ControlEventType || (exports.ControlEventType = ControlEventType = {}));
	var ControlEvent = class extends Event_1.default {
		constructor(delta = 0, channel = 0) {
			super(delta);
			this._channel = 0;
			this.channel = channel;
		}
		get channel() {
			var _a;
			return (_a = this._channelAccessor) !== null && _a !== void 0 ? _a : this._channelAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._channel, (value) => {
				this.channel = value;
			});
		}
		set channel(value) {
			this.assertValidChannel(value);
			this._channel = value;
		}
		writeType(stream, status) {
			const hibyte = this.getTypeHibyte();
			if (status && status[0] === hibyte && status[1] === this._channel) return;
			stream.writeByte(hibyte | this._channel);
			if (status) {
				status[0] = hibyte;
				status[1] = this._channel;
			}
		}
		assertValidKey(value) {
			this.assertPositiveInteger(value);
			this.assertUnsignedAndBelow(value, 127);
		}
		assertValidVelocityLike(value) {
			this.assertPositiveInteger(value);
			this.assertUnsignedAndBelow(value, 127);
		}
	};
	exports.default = ControlEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/control/NoteEvent.js
var require_NoteEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ControlEvent_1 = __importDefault(require_ControlEvent());
	var CallableProperty_1 = require_CallableProperty();
	var NoteEvent = class extends ControlEvent_1.default {
		constructor(delta, channel, key = 60, velocity = 127) {
			super(delta, channel);
			this._key = 60;
			this._velocity = 127;
			this.key = key;
			this.velocity = velocity;
		}
		get key() {
			var _a;
			return (_a = this._keyAccessor) !== null && _a !== void 0 ? _a : this._keyAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._key, (value) => {
				this.key = value;
			});
		}
		set key(value) {
			this.assertValidKey(value);
			this._key = value;
		}
		get velocity() {
			var _a;
			return (_a = this._velocityAccessor) !== null && _a !== void 0 ? _a : this._velocityAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._velocity, (value) => {
				this.velocity = value;
			});
		}
		set velocity(value) {
			this.assertValidVelocityLike(value);
			this._velocity = value;
		}
		readBytes(stream) {
			this.key = stream.readByte();
			this.velocity = stream.readByte();
		}
		writeBytes(stream, status) {
			super.writeBytes(stream, status);
			stream.writeByte(this.key);
			stream.writeByte(this.velocity);
		}
	};
	exports.default = NoteEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/control/NoteOnEvent.js
var require_NoteOnEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ControlEvent_1 = require_ControlEvent();
	var NoteEvent_1 = __importDefault(require_NoteEvent());
	var NoteOnEvent = class extends NoteEvent_1.default {
		getTypeHibyte() {
			return ControlEvent_1.ControlEventType.NOTE_ON;
		}
	};
	exports.default = NoteOnEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/control/NoteOffEvent.js
var require_NoteOffEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ControlEvent_1 = require_ControlEvent();
	var NoteEvent_1 = __importDefault(require_NoteEvent());
	var NoteOffEvent = class extends NoteEvent_1.default {
		getTypeHibyte() {
			return ControlEvent_1.ControlEventType.NOTE_OFF;
		}
	};
	exports.default = NoteOffEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/control/AftertouchEvent.js
var require_AftertouchEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ControlEvent_1 = __importStar(require_ControlEvent());
	var CallableProperty_1 = require_CallableProperty();
	var AftertouchEvent = class extends ControlEvent_1.default {
		constructor() {
			super(...arguments);
			this._key = 60;
			this._pressure = 127;
		}
		get key() {
			var _a;
			return (_a = this._keyAccessor) !== null && _a !== void 0 ? _a : this._keyAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._key, (value) => {
				this.key = value;
			});
		}
		set key(value) {
			this.assertValidKey(value);
			this._key = value;
		}
		get pressure() {
			var _a;
			return (_a = this._pressureAccessor) !== null && _a !== void 0 ? _a : this._pressureAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._pressure, (value) => {
				this.pressure = value;
			});
		}
		set pressure(value) {
			this.assertValidVelocityLike(value);
			this._pressure = value;
		}
		readBytes(stream) {
			this.key = stream.readByte();
			this.pressure = stream.readByte();
		}
		writeBytes(stream, status) {
			super.writeBytes(stream, status);
			stream.writeByte(this.key);
			stream.writeByte(this.pressure);
		}
		getTypeHibyte() {
			return ControlEvent_1.ControlEventType.AFTERTOUCH;
		}
	};
	exports.default = AftertouchEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/control/ControllerEvent.js
var require_ControllerEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ControllerType = exports.NamedControllerType = void 0;
	var ControlEvent_1 = __importStar(require_ControlEvent());
	var CallableProperty_1 = require_CallableProperty();
	var NamedControllerType;
	(function(NamedControllerType) {
		NamedControllerType[NamedControllerType["BANK_SELECT_COARSE"] = 0] = "BANK_SELECT_COARSE";
		NamedControllerType[NamedControllerType["MODULATION_WHEEL_COARSE"] = 1] = "MODULATION_WHEEL_COARSE";
		NamedControllerType[NamedControllerType["BREATH_CONTROLLER_COARSE"] = 2] = "BREATH_CONTROLLER_COARSE";
		NamedControllerType[NamedControllerType["FOOT_CONTROLLER_COARSE"] = 4] = "FOOT_CONTROLLER_COARSE";
		NamedControllerType[NamedControllerType["PORTAMENTO_TIME_COARSE"] = 5] = "PORTAMENTO_TIME_COARSE";
		NamedControllerType[NamedControllerType["DATA_ENTRY_COARSE"] = 6] = "DATA_ENTRY_COARSE";
		NamedControllerType[NamedControllerType["CHANNEL_VOLUME_COARSE"] = 7] = "CHANNEL_VOLUME_COARSE";
		NamedControllerType[NamedControllerType["BALANCE_COARSE"] = 8] = "BALANCE_COARSE";
		NamedControllerType[NamedControllerType["PAN_COARSE"] = 10] = "PAN_COARSE";
		NamedControllerType[NamedControllerType["EXPRESSION_COARSE2"] = 11] = "EXPRESSION_COARSE2";
		NamedControllerType[NamedControllerType["EFFECT_CONTROL_1_COARSE"] = 12] = "EFFECT_CONTROL_1_COARSE";
		NamedControllerType[NamedControllerType["EFFECT_CONTROL_2_COARSE"] = 13] = "EFFECT_CONTROL_2_COARSE";
		NamedControllerType[NamedControllerType["GENERAL_PURPOSE_CONTROLLER_1_COARSE"] = 16] = "GENERAL_PURPOSE_CONTROLLER_1_COARSE";
		NamedControllerType[NamedControllerType["GENERAL_PURPOSE_CONTROLLER_2_COARSE"] = 17] = "GENERAL_PURPOSE_CONTROLLER_2_COARSE";
		NamedControllerType[NamedControllerType["GENERAL_PURPOSE_CONTROLLER_3_COARSE"] = 18] = "GENERAL_PURPOSE_CONTROLLER_3_COARSE";
		NamedControllerType[NamedControllerType["GENERAL_PURPOSE_CONTROLLER_4_COARSE"] = 19] = "GENERAL_PURPOSE_CONTROLLER_4_COARSE";
		NamedControllerType[NamedControllerType["BANK_SELECT_FINE"] = 32] = "BANK_SELECT_FINE";
		NamedControllerType[NamedControllerType["MODULATION_WHEEL_FINE"] = 33] = "MODULATION_WHEEL_FINE";
		NamedControllerType[NamedControllerType["BREATH_CONTROLLER_FINE"] = 34] = "BREATH_CONTROLLER_FINE";
		NamedControllerType[NamedControllerType["FOOT_CONTROLLER_FINE"] = 36] = "FOOT_CONTROLLER_FINE";
		NamedControllerType[NamedControllerType["PORTAMENTO_TIME_FINE"] = 37] = "PORTAMENTO_TIME_FINE";
		NamedControllerType[NamedControllerType["DATA_ENTRY_FINE"] = 38] = "DATA_ENTRY_FINE";
		NamedControllerType[NamedControllerType["CHANNEL_VOLUME_FINE"] = 39] = "CHANNEL_VOLUME_FINE";
		NamedControllerType[NamedControllerType["BALANCE_FINE"] = 40] = "BALANCE_FINE";
		NamedControllerType[NamedControllerType["PAN_FINE"] = 42] = "PAN_FINE";
		NamedControllerType[NamedControllerType["EXPRESSION_FINE2"] = 43] = "EXPRESSION_FINE2";
		NamedControllerType[NamedControllerType["EFFECT_CONTROL_1_FINE"] = 44] = "EFFECT_CONTROL_1_FINE";
		NamedControllerType[NamedControllerType["EFFECT_CONTROL_2_FINE"] = 45] = "EFFECT_CONTROL_2_FINE";
		NamedControllerType[NamedControllerType["HOLD_PEDAL_1"] = 64] = "HOLD_PEDAL_1";
		NamedControllerType[NamedControllerType["PORTAMENTO_PEDAL"] = 65] = "PORTAMENTO_PEDAL";
		NamedControllerType[NamedControllerType["SOSTENUTO_PEDAL"] = 66] = "SOSTENUTO_PEDAL";
		NamedControllerType[NamedControllerType["SOFT_PEDAL"] = 67] = "SOFT_PEDAL";
		NamedControllerType[NamedControllerType["LEGATO_PEDAL"] = 68] = "LEGATO_PEDAL";
		NamedControllerType[NamedControllerType["HOLD_PEDAL_2"] = 69] = "HOLD_PEDAL_2";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_1"] = 70] = "SOUND_CONTROLLER_1";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_2"] = 71] = "SOUND_CONTROLLER_2";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_3"] = 72] = "SOUND_CONTROLLER_3";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_4"] = 73] = "SOUND_CONTROLLER_4";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_5"] = 74] = "SOUND_CONTROLLER_5";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_6"] = 75] = "SOUND_CONTROLLER_6";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_7"] = 76] = "SOUND_CONTROLLER_7";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_8"] = 77] = "SOUND_CONTROLLER_8";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_9"] = 78] = "SOUND_CONTROLLER_9";
		NamedControllerType[NamedControllerType["SOUND_CONTROLLER_10"] = 79] = "SOUND_CONTROLLER_10";
		NamedControllerType[NamedControllerType["GENERAL_PURPOSE_CONTROLLER_5"] = 80] = "GENERAL_PURPOSE_CONTROLLER_5";
		NamedControllerType[NamedControllerType["GENERAL_PURPOSE_CONTROLLER_6"] = 81] = "GENERAL_PURPOSE_CONTROLLER_6";
		NamedControllerType[NamedControllerType["GENERAL_PURPOSE_CONTROLLER_7"] = 82] = "GENERAL_PURPOSE_CONTROLLER_7";
		NamedControllerType[NamedControllerType["GENERAL_PURPOSE_CONTROLLER_8"] = 83] = "GENERAL_PURPOSE_CONTROLLER_8";
		NamedControllerType[NamedControllerType["PORTAMENTO_CONTROL"] = 84] = "PORTAMENTO_CONTROL";
		NamedControllerType[NamedControllerType["HIGH_RESOLUTION_VELOCITY_PREFIX"] = 88] = "HIGH_RESOLUTION_VELOCITY_PREFIX";
		NamedControllerType[NamedControllerType["EFFECT_1_DEPTH"] = 91] = "EFFECT_1_DEPTH";
		NamedControllerType[NamedControllerType["EFFECT_2_DEPTH"] = 92] = "EFFECT_2_DEPTH";
		NamedControllerType[NamedControllerType["EFFECT_3_DEPTH"] = 93] = "EFFECT_3_DEPTH";
		NamedControllerType[NamedControllerType["EFFECT_4_DEPTH"] = 94] = "EFFECT_4_DEPTH";
		NamedControllerType[NamedControllerType["EFFECT_5_DEPTH"] = 95] = "EFFECT_5_DEPTH";
		NamedControllerType[NamedControllerType["DATA_BUTTON_INCREMENT"] = 96] = "DATA_BUTTON_INCREMENT";
		NamedControllerType[NamedControllerType["DATA_BUTTON_DECREMENT"] = 97] = "DATA_BUTTON_DECREMENT";
		NamedControllerType[NamedControllerType["NON_REGISTERED_PARAMETER_COARSE"] = 98] = "NON_REGISTERED_PARAMETER_COARSE";
		NamedControllerType[NamedControllerType["NON_REGISTERED_PARAMETER_FINE"] = 99] = "NON_REGISTERED_PARAMETER_FINE";
		NamedControllerType[NamedControllerType["REGISTERED_PARAMETER_COARSE"] = 100] = "REGISTERED_PARAMETER_COARSE";
		NamedControllerType[NamedControllerType["REGISTERED_PARAMETER_FINE"] = 101] = "REGISTERED_PARAMETER_FINE";
		NamedControllerType[NamedControllerType["ALL_SOUND_OFF"] = 120] = "ALL_SOUND_OFF";
		NamedControllerType[NamedControllerType["ALL_CONTROLLERS_OFF"] = 121] = "ALL_CONTROLLERS_OFF";
		NamedControllerType[NamedControllerType["LOCAL_CONTROL"] = 122] = "LOCAL_CONTROL";
		NamedControllerType[NamedControllerType["ALL_NOTES_OFF"] = 123] = "ALL_NOTES_OFF";
		NamedControllerType[NamedControllerType["OMNI_MODE_OFF"] = 124] = "OMNI_MODE_OFF";
		NamedControllerType[NamedControllerType["OMNI_MODE_ON"] = 125] = "OMNI_MODE_ON";
		NamedControllerType[NamedControllerType["MONO_OPERATION_AND_ALL_NOTES_OFF"] = 126] = "MONO_OPERATION_AND_ALL_NOTES_OFF";
		NamedControllerType[NamedControllerType["POLY_OPERATION_AND_ALL_NOTES_OFF"] = 127] = "POLY_OPERATION_AND_ALL_NOTES_OFF";
	})(NamedControllerType || (exports.NamedControllerType = NamedControllerType = {}));
	exports.ControllerType = NamedControllerType;
	var ControllerEvent = class extends ControlEvent_1.default {
		constructor(delta, channel, controller = exports.ControllerType.BANK_SELECT_COARSE, value) {
			super(delta, channel);
			this._controller = exports.ControllerType.BANK_SELECT_COARSE;
			this._value = 0;
			this.controller = controller;
			if (value) this.value = value;
		}
		assertValidControllerValue(value) {
			this.assertUnsignedAndBelow(value, 127);
		}
		get controller() {
			var _a;
			return (_a = this._controllerAccessor) !== null && _a !== void 0 ? _a : this._controllerAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._controller, (value) => {
				this.controller = value;
			});
		}
		set controller(value) {
			this._controller = value;
		}
		get value() {
			var _a;
			return (_a = this._valueAccessor) !== null && _a !== void 0 ? _a : this._valueAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._value, (value) => {
				this.value = value;
			});
		}
		set value(value) {
			this.assertValidControllerValue(value);
			this._value = value;
		}
		readBytes(stream) {
			this.controller = stream.readByte();
			this.value = stream.readByte();
		}
		writeBytes(stream, status) {
			super.writeBytes(stream, status);
			stream.writeByte(this.controller);
			stream.writeByte(this.value);
		}
		getTypeHibyte() {
			return ControlEvent_1.ControlEventType.CONTROLLER;
		}
	};
	exports.default = ControllerEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/control/ChannelAftertouchEvent.js
var require_ChannelAftertouchEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ControlEvent_1 = __importStar(require_ControlEvent());
	var CallableProperty_1 = require_CallableProperty();
	var ChannelAftertouchEvent = class extends ControlEvent_1.default {
		constructor() {
			super(...arguments);
			this._pressure = 127;
		}
		get pressure() {
			var _a;
			return (_a = this._pressureAccessor) !== null && _a !== void 0 ? _a : this._pressureAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._pressure, (value) => {
				this.pressure = value;
			});
		}
		set pressure(value) {
			this.assertValidVelocityLike(value);
			this._pressure = value;
		}
		readBytes(stream) {
			this.pressure = stream.readByte();
		}
		writeBytes(stream, status) {
			super.writeBytes(stream, status);
			stream.writeByte(this.pressure);
		}
		getTypeHibyte() {
			return ControlEvent_1.ControlEventType.CHANNEL_AFTERTOUCH;
		}
	};
	exports.default = ChannelAftertouchEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/control/ProgramChangeEvent.js
var require_ProgramChangeEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProgramType = void 0;
	var ControlEvent_1 = __importStar(require_ControlEvent());
	var CallableProperty_1 = require_CallableProperty();
	var ProgramType;
	(function(ProgramType) {
		ProgramType[ProgramType["ACOUSTIC_GRAND_PIANO"] = 0] = "ACOUSTIC_GRAND_PIANO";
		ProgramType[ProgramType["BRIGHT_ACOUSTIC_PIANO"] = 1] = "BRIGHT_ACOUSTIC_PIANO";
		ProgramType[ProgramType["ELECTRIC_GRAND_PIANO"] = 2] = "ELECTRIC_GRAND_PIANO";
		ProgramType[ProgramType["HONKY_TONK_PIANO"] = 3] = "HONKY_TONK_PIANO";
		ProgramType[ProgramType["ELECTRIC_PIANO_1"] = 4] = "ELECTRIC_PIANO_1";
		ProgramType[ProgramType["ELECTRIC_PIANO_2"] = 5] = "ELECTRIC_PIANO_2";
		ProgramType[ProgramType["HARPSICHORD"] = 6] = "HARPSICHORD";
		ProgramType[ProgramType["CLAVINET"] = 7] = "CLAVINET";
		ProgramType[ProgramType["CELESTA"] = 8] = "CELESTA";
		ProgramType[ProgramType["GLOCKENSPIEL"] = 9] = "GLOCKENSPIEL";
		ProgramType[ProgramType["MUSIC_BOX"] = 10] = "MUSIC_BOX";
		ProgramType[ProgramType["VIBRAPHONE"] = 11] = "VIBRAPHONE";
		ProgramType[ProgramType["MARIMBA"] = 12] = "MARIMBA";
		ProgramType[ProgramType["XYLOPHONE"] = 13] = "XYLOPHONE";
		ProgramType[ProgramType["TUBULAR_BELLS"] = 14] = "TUBULAR_BELLS";
		ProgramType[ProgramType["DULCIMER"] = 15] = "DULCIMER";
		ProgramType[ProgramType["DRAWBAR_ORGAN"] = 16] = "DRAWBAR_ORGAN";
		ProgramType[ProgramType["PERCUSSIVE_ORGAN"] = 17] = "PERCUSSIVE_ORGAN";
		ProgramType[ProgramType["ROCK_ORGAN"] = 18] = "ROCK_ORGAN";
		ProgramType[ProgramType["CHURCH_ORGAN"] = 19] = "CHURCH_ORGAN";
		ProgramType[ProgramType["REED_ORGAN"] = 20] = "REED_ORGAN";
		ProgramType[ProgramType["ACCORDION"] = 21] = "ACCORDION";
		ProgramType[ProgramType["HARMONICA"] = 22] = "HARMONICA";
		ProgramType[ProgramType["TANGO_ACCORDION"] = 23] = "TANGO_ACCORDION";
		ProgramType[ProgramType["ACOUSTIC_GUITAR_NYLON"] = 24] = "ACOUSTIC_GUITAR_NYLON";
		ProgramType[ProgramType["ACOUSTIC_GUITAR_STEEL"] = 25] = "ACOUSTIC_GUITAR_STEEL";
		ProgramType[ProgramType["ELECTRIC_GUITAR_JAZZ"] = 26] = "ELECTRIC_GUITAR_JAZZ";
		ProgramType[ProgramType["ELECTRIC_GUITAR_CLEAN"] = 27] = "ELECTRIC_GUITAR_CLEAN";
		ProgramType[ProgramType["ELECTRIC_GUITAR_MUTED"] = 28] = "ELECTRIC_GUITAR_MUTED";
		ProgramType[ProgramType["OVERDRIVEN_GUITAR"] = 29] = "OVERDRIVEN_GUITAR";
		ProgramType[ProgramType["DISTORTION_GUITAR"] = 30] = "DISTORTION_GUITAR";
		ProgramType[ProgramType["GUITAR_HARMONICS"] = 31] = "GUITAR_HARMONICS";
		ProgramType[ProgramType["ACOUSTIC_BASS"] = 32] = "ACOUSTIC_BASS";
		ProgramType[ProgramType["ELECTRIC_BASS_FINGER"] = 33] = "ELECTRIC_BASS_FINGER";
		ProgramType[ProgramType["ELECTRIC_BASS_PICK"] = 34] = "ELECTRIC_BASS_PICK";
		ProgramType[ProgramType["FRETLESS_BASS"] = 35] = "FRETLESS_BASS";
		ProgramType[ProgramType["SLAP_BASS_1"] = 36] = "SLAP_BASS_1";
		ProgramType[ProgramType["SLAP_BASS_2"] = 37] = "SLAP_BASS_2";
		ProgramType[ProgramType["SYNTH_BASS_1"] = 38] = "SYNTH_BASS_1";
		ProgramType[ProgramType["SYNTH_BASS_2"] = 39] = "SYNTH_BASS_2";
		ProgramType[ProgramType["VIOLIN"] = 40] = "VIOLIN";
		ProgramType[ProgramType["VIOLA"] = 41] = "VIOLA";
		ProgramType[ProgramType["CELLO"] = 42] = "CELLO";
		ProgramType[ProgramType["CONTRABASS"] = 43] = "CONTRABASS";
		ProgramType[ProgramType["TREMOLO_STRINGS"] = 44] = "TREMOLO_STRINGS";
		ProgramType[ProgramType["PIZZICATO_STRINGS"] = 45] = "PIZZICATO_STRINGS";
		ProgramType[ProgramType["ORCHESTRAL_HARP"] = 46] = "ORCHESTRAL_HARP";
		ProgramType[ProgramType["TIMPANI"] = 47] = "TIMPANI";
		ProgramType[ProgramType["STRING_ENSEMBLE_1"] = 48] = "STRING_ENSEMBLE_1";
		ProgramType[ProgramType["STRING_ENSEMBLE_2"] = 49] = "STRING_ENSEMBLE_2";
		ProgramType[ProgramType["SYNTH_STRINGS_1"] = 50] = "SYNTH_STRINGS_1";
		ProgramType[ProgramType["SYNTH_STRINGS_2"] = 51] = "SYNTH_STRINGS_2";
		ProgramType[ProgramType["CHOIR_AAHS"] = 52] = "CHOIR_AAHS";
		ProgramType[ProgramType["VOICE_OOHS"] = 53] = "VOICE_OOHS";
		ProgramType[ProgramType["SYNTH_VOICE"] = 54] = "SYNTH_VOICE";
		ProgramType[ProgramType["ORCHESTRA_HIT"] = 55] = "ORCHESTRA_HIT";
		ProgramType[ProgramType["TRUMPET"] = 56] = "TRUMPET";
		ProgramType[ProgramType["TROMBONE"] = 57] = "TROMBONE";
		ProgramType[ProgramType["TUBA"] = 58] = "TUBA";
		ProgramType[ProgramType["MUTED_TRUMPET"] = 59] = "MUTED_TRUMPET";
		ProgramType[ProgramType["FRENCH_HORN"] = 60] = "FRENCH_HORN";
		ProgramType[ProgramType["BRASS_SECTION"] = 61] = "BRASS_SECTION";
		ProgramType[ProgramType["SYNTH_BRASS_1"] = 62] = "SYNTH_BRASS_1";
		ProgramType[ProgramType["SYNTH_BRASS_2"] = 63] = "SYNTH_BRASS_2";
		ProgramType[ProgramType["SOPRANO_SAX"] = 64] = "SOPRANO_SAX";
		ProgramType[ProgramType["ALTO_SAX"] = 65] = "ALTO_SAX";
		ProgramType[ProgramType["TENOR_SAX"] = 66] = "TENOR_SAX";
		ProgramType[ProgramType["BARITONE_SAX"] = 67] = "BARITONE_SAX";
		ProgramType[ProgramType["OBOE"] = 68] = "OBOE";
		ProgramType[ProgramType["ENGLISH_HORN"] = 69] = "ENGLISH_HORN";
		ProgramType[ProgramType["BASSOON"] = 70] = "BASSOON";
		ProgramType[ProgramType["CLARINET"] = 71] = "CLARINET";
		ProgramType[ProgramType["PICCOLO"] = 72] = "PICCOLO";
		ProgramType[ProgramType["FLUTE"] = 73] = "FLUTE";
		ProgramType[ProgramType["RECORDER"] = 74] = "RECORDER";
		ProgramType[ProgramType["PAN_FLUTE"] = 75] = "PAN_FLUTE";
		ProgramType[ProgramType["BLOWN_BOTTLE"] = 76] = "BLOWN_BOTTLE";
		ProgramType[ProgramType["SHAKUHACHI"] = 77] = "SHAKUHACHI";
		ProgramType[ProgramType["WHISTLE"] = 78] = "WHISTLE";
		ProgramType[ProgramType["OCARINA"] = 79] = "OCARINA";
		ProgramType[ProgramType["LEAD_1_SQUARE"] = 80] = "LEAD_1_SQUARE";
		ProgramType[ProgramType["LEAD_2_SAWTOOTH"] = 81] = "LEAD_2_SAWTOOTH";
		ProgramType[ProgramType["LEAD_3_CALLIOPE"] = 82] = "LEAD_3_CALLIOPE";
		ProgramType[ProgramType["LEAD_4_CHIFF"] = 83] = "LEAD_4_CHIFF";
		ProgramType[ProgramType["LEAD_5_CHARANG"] = 84] = "LEAD_5_CHARANG";
		ProgramType[ProgramType["LEAD_6_VOICE"] = 85] = "LEAD_6_VOICE";
		ProgramType[ProgramType["LEAD_7_FIFTHS"] = 86] = "LEAD_7_FIFTHS";
		ProgramType[ProgramType["LEAD_8_BASS_AND_LEAD"] = 87] = "LEAD_8_BASS_AND_LEAD";
		ProgramType[ProgramType["PAD_1_NEW_AGE"] = 88] = "PAD_1_NEW_AGE";
		ProgramType[ProgramType["PAD_2_WARM"] = 89] = "PAD_2_WARM";
		ProgramType[ProgramType["PAD_3_POLYSYNTH"] = 90] = "PAD_3_POLYSYNTH";
		ProgramType[ProgramType["PAD_4_CHOIR"] = 91] = "PAD_4_CHOIR";
		ProgramType[ProgramType["PAD_5_BOWED"] = 92] = "PAD_5_BOWED";
		ProgramType[ProgramType["PAD_6_METALLIC"] = 93] = "PAD_6_METALLIC";
		ProgramType[ProgramType["PAD_7_HALO"] = 94] = "PAD_7_HALO";
		ProgramType[ProgramType["PAD_8_SWEEP"] = 95] = "PAD_8_SWEEP";
		ProgramType[ProgramType["FX_1_RAIN"] = 96] = "FX_1_RAIN";
		ProgramType[ProgramType["FX_2_SOUNDTRACK"] = 97] = "FX_2_SOUNDTRACK";
		ProgramType[ProgramType["FX_3_CRYSTAL"] = 98] = "FX_3_CRYSTAL";
		ProgramType[ProgramType["FX_4_ATMOSPHERE"] = 99] = "FX_4_ATMOSPHERE";
		ProgramType[ProgramType["FX_5_BRIGHTNESS"] = 100] = "FX_5_BRIGHTNESS";
		ProgramType[ProgramType["FX_6_GOBLINS"] = 101] = "FX_6_GOBLINS";
		ProgramType[ProgramType["FX_7_ECHOES"] = 102] = "FX_7_ECHOES";
		ProgramType[ProgramType["FX_8_SCI_FI"] = 103] = "FX_8_SCI_FI";
		ProgramType[ProgramType["SITAR"] = 104] = "SITAR";
		ProgramType[ProgramType["BANJO"] = 105] = "BANJO";
		ProgramType[ProgramType["SHAMISEN"] = 106] = "SHAMISEN";
		ProgramType[ProgramType["KOTO"] = 107] = "KOTO";
		ProgramType[ProgramType["KALIMBA"] = 108] = "KALIMBA";
		ProgramType[ProgramType["BAG_PIPE"] = 109] = "BAG_PIPE";
		ProgramType[ProgramType["FIDDLE"] = 110] = "FIDDLE";
		ProgramType[ProgramType["SHANAI"] = 111] = "SHANAI";
		ProgramType[ProgramType["TINKLE_BELL"] = 112] = "TINKLE_BELL";
		ProgramType[ProgramType["AGOGO"] = 113] = "AGOGO";
		ProgramType[ProgramType["STEEL_DRUMS"] = 114] = "STEEL_DRUMS";
		ProgramType[ProgramType["WOODBLOCK"] = 115] = "WOODBLOCK";
		ProgramType[ProgramType["TAIKO_DRUM"] = 116] = "TAIKO_DRUM";
		ProgramType[ProgramType["MELODIC_TOM"] = 117] = "MELODIC_TOM";
		ProgramType[ProgramType["SYNTH_DRUM"] = 118] = "SYNTH_DRUM";
		ProgramType[ProgramType["REVERSE_CYMBAL"] = 119] = "REVERSE_CYMBAL";
		ProgramType[ProgramType["GUITAR_FRET_NOISE"] = 120] = "GUITAR_FRET_NOISE";
		ProgramType[ProgramType["BREATH_NOISE"] = 121] = "BREATH_NOISE";
		ProgramType[ProgramType["SEASHORE"] = 122] = "SEASHORE";
		ProgramType[ProgramType["BIRD_TWEET"] = 123] = "BIRD_TWEET";
		ProgramType[ProgramType["TELEPHONE_RING"] = 124] = "TELEPHONE_RING";
		ProgramType[ProgramType["HELICOPTER"] = 125] = "HELICOPTER";
		ProgramType[ProgramType["APPLAUSE"] = 126] = "APPLAUSE";
		ProgramType[ProgramType["GUNSHOT"] = 127] = "GUNSHOT";
	})(ProgramType || (exports.ProgramType = ProgramType = {}));
	var ProgramChangeEvent = class extends ControlEvent_1.default {
		constructor() {
			super(...arguments);
			this._program = ProgramType.ACOUSTIC_GRAND_PIANO;
		}
		get program() {
			var _a;
			return (_a = this._programAccessor) !== null && _a !== void 0 ? _a : this._programAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._program, (value) => {
				this.program = value;
			});
		}
		set program(value) {
			this._program = value;
		}
		readBytes(stream) {
			this.program = stream.readByte();
		}
		writeBytes(stream, status) {
			super.writeBytes(stream, status);
			stream.writeByte(this.program);
		}
		getTypeHibyte() {
			return ControlEvent_1.ControlEventType.PROGRAM_CHANGE;
		}
	};
	exports.default = ProgramChangeEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/control/PitchWheelEvent.js
var require_PitchWheelEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ControlEvent_1 = __importStar(require_ControlEvent());
	var ParseError_1 = __importDefault(require_ParseError());
	var CallableProperty_1 = require_CallableProperty();
	var PitchWheelEvent = class extends ControlEvent_1.default {
		constructor(delta, channel, amount = 0) {
			super(delta, channel);
			this._value = 8192;
			this.amount = amount;
		}
		get value() {
			var _a;
			return (_a = this._valueAccessor) !== null && _a !== void 0 ? _a : this._valueAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._value, (value) => {
				this.value = value;
			});
		}
		set value(value) {
			this._value = value;
		}
		readBytes(stream) {
			const first = stream.readByte();
			const second = stream.readByte();
			if (first & 128) throw new ParseError_1.default(stream, "Expected first bit of first byte to be zero");
			this.value = (second & 127) << 7 | first & 127;
		}
		writeBytes(stream, status) {
			super.writeBytes(stream, status);
			const left = this.value & 127;
			const right = (this.value & 16256) >> 7;
			stream.writeByte(left);
			stream.writeByte(right);
		}
		getTypeHibyte() {
			return ControlEvent_1.ControlEventType.PITCH_WHEEL;
		}
		get amount() {
			var _a;
			return (_a = this._amountAccessor) !== null && _a !== void 0 ? _a : this._amountAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => {
				if (this._value <= 8192) return -1 + 2 * ((1 + this._value) / 16383);
				return -1 + 2 * (this._value / 16383);
			}, (value) => {
				this.amount = value;
			});
		}
		set amount(floating) {
			if (floating < -1 || floating > 1) throw new RangeError("Expected value within -1 to +1");
			if (floating > 0) this.value = 8192 + (Math.round(floating * 8192) - 1);
			else this.value = Math.round((floating + 1) * 8192);
		}
	};
	exports.default = PitchWheelEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/exceptions/ParseControlEventError.js
var require_ParseControlEventError = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ParseError_1 = __importDefault(require_ParseError());
	var ParseControlEventError = class extends ParseError_1.default {};
	exports.default = ParseControlEventError;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/factories/ControlEventFactory.js
var require_ControlEventFactory = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var NoteOnEvent_1 = __importDefault(require_NoteOnEvent());
	var NoteOffEvent_1 = __importDefault(require_NoteOffEvent());
	var AftertouchEvent_1 = __importDefault(require_AftertouchEvent());
	var ControllerEvent_1 = __importDefault(require_ControllerEvent());
	var ChannelAftertouchEvent_1 = __importDefault(require_ChannelAftertouchEvent());
	var ProgramChangeEvent_1 = __importDefault(require_ProgramChangeEvent());
	var PitchWheelEvent_1 = __importDefault(require_PitchWheelEvent());
	var ParseControlEventError_1 = __importDefault(require_ParseControlEventError());
	var ControlEventType;
	(function(ControlEventType) {
		ControlEventType[ControlEventType["NOTE_OFF"] = 128] = "NOTE_OFF";
		ControlEventType[ControlEventType["NOTE_ON"] = 144] = "NOTE_ON";
		ControlEventType[ControlEventType["AFTERTOUCH"] = 160] = "AFTERTOUCH";
		ControlEventType[ControlEventType["CONTROLLER"] = 176] = "CONTROLLER";
		ControlEventType[ControlEventType["PROGRAM_CHANGE"] = 192] = "PROGRAM_CHANGE";
		ControlEventType[ControlEventType["CHANNEL_AFTERTOUCH"] = 208] = "CHANNEL_AFTERTOUCH";
		ControlEventType[ControlEventType["PITCH_WHEEL"] = 224] = "PITCH_WHEEL";
	})(ControlEventType || (ControlEventType = {}));
	var ControlEventFactory = class {
		static fromStream(stream, leading, delta, status) {
			const running = (leading & 240) < 128;
			let type, channel;
			let result;
			if (running) {
				type = status[0];
				channel = status[1];
				stream.seekRelative(-1);
			} else {
				status[0] = type = leading & 240;
				status[1] = channel = leading & 15;
			}
			switch (type) {
				case ControlEventType.NOTE_ON:
					result = new NoteOnEvent_1.default(delta, channel);
					break;
				case ControlEventType.NOTE_OFF:
					result = new NoteOffEvent_1.default(delta, channel);
					break;
				case ControlEventType.AFTERTOUCH:
					result = new AftertouchEvent_1.default(delta, channel);
					break;
				case ControlEventType.CONTROLLER:
					result = new ControllerEvent_1.default(delta, channel);
					break;
				case ControlEventType.PITCH_WHEEL:
					result = new PitchWheelEvent_1.default(delta, channel);
					break;
				case ControlEventType.PROGRAM_CHANGE:
					result = new ProgramChangeEvent_1.default(delta, channel);
					break;
				case ControlEventType.CHANNEL_AFTERTOUCH:
					result = new ChannelAftertouchEvent_1.default(delta, channel);
					break;
				default: throw new ParseControlEventError_1.default(stream, "Invalid control event type 0x" + type.toString(16));
			}
			result.readBytes(stream);
			return result;
		}
	};
	exports.default = ControlEventFactory;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/sysex/SysExEvent.js
var require_SysExEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UniversalDevices = void 0;
	var DeviceManufacturer_1 = __importDefault(require_DeviceManufacturer());
	var Event_1 = __importStar(require_Event());
	var CallableProperty_1 = require_CallableProperty();
	var UniversalDevices;
	(function(UniversalDevices) {
		UniversalDevices[UniversalDevices["NON_REAL_TIME"] = 126] = "NON_REAL_TIME";
		UniversalDevices[UniversalDevices["REAL_TIME"] = 127] = "REAL_TIME";
	})(UniversalDevices || (exports.UniversalDevices = UniversalDevices = {}));
	var SysExEvent = class extends Event_1.default {
		constructor() {
			super(...arguments);
			this._manufacturer = DeviceManufacturer_1.default.AKAI;
			this.bytes = new Uint8Array();
		}
		get manufacturer() {
			var _a;
			return (_a = this._manufacturerAccessor) !== null && _a !== void 0 ? _a : this._manufacturerAccessor = (0, CallableProperty_1.createCallableAccessor)(this, () => this._manufacturer, (value) => {
				this.manufacturer = value;
			});
		}
		set manufacturer(value) {
			this._manufacturer = value;
		}
		readBytes(stream) {
			const buffer = [];
			let byte;
			this.manufacturer = stream.readByte();
			while ((byte = stream.readByte()) !== 247) buffer.push(byte);
			this.bytes = new Uint8Array(buffer);
		}
		writeBytes(stream) {
			super.writeBytes(stream);
			stream.writeByte(this.manufacturer);
			for (let i = 0; i < this.bytes.length; i++) stream.writeByte(this.bytes[i]);
			stream.writeByte(247);
		}
		writeType(stream) {
			stream.writeByte(Event_1.EventType.SYSEX);
		}
	};
	exports.default = SysExEvent;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/factories/EventFactory.js
var require_EventFactory = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Event_1 = require_Event();
	var MetaEventFactory_1 = __importDefault(require_MetaEventFactory());
	var ControlEventFactory_1 = __importDefault(require_ControlEventFactory());
	var SysExEvent_1 = __importDefault(require_SysExEvent());
	var EventFactory = class {
		static fromStream(stream, status, delta = 0) {
			const type = stream.readByte() & 255;
			let result;
			switch (type) {
				case Event_1.EventType.META:
					result = MetaEventFactory_1.default.fromStream(stream, delta);
					break;
				case Event_1.EventType.SYSEX:
					result = new SysExEvent_1.default(delta);
					result.readBytes(stream);
					break;
				default:
					result = ControlEventFactory_1.default.fromStream(stream, type, delta, status);
					break;
			}
			return result;
		}
	};
	exports.default = EventFactory;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/exceptions/UnsupportedTrackError.js
var require_UnsupportedTrackError = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ParseError_1 = __importDefault(require_ParseError());
	var UnsupportedTrackError = class extends ParseError_1.default {};
	exports.default = UnsupportedTrackError;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/exceptions/ValidationError.js
var require_ValidationError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ValidationError = class extends Error {};
	exports.default = ValidationError;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/validators/TrackValidator.js
var require_TrackValidator = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var CopyrightEvent_1 = __importDefault(require_CopyrightEvent());
	var EndOfTrackEvent_1 = __importDefault(require_EndOfTrackEvent());
	var SequenceNumberEvent_1 = __importDefault(require_SequenceNumberEvent());
	var TrackNameEvent_1 = __importDefault(require_TrackNameEvent());
	var ValidationError_1 = __importDefault(require_ValidationError());
	var TrackValidator = class {
		constructor(track) {
			this.track = track;
		}
		validateZeroAbsoluteTime(index) {
			for (let i = index; i >= 0; i--) if (this.track.events[i].delta > 0) throw new ValidationError_1.default("Event must have zero delta time and cannot occur after non-zero delta time events");
		}
		validateEvent(event, index) {
			if (event instanceof EndOfTrackEvent_1.default && index !== this.track.events.length - 1) throw new ValidationError_1.default("Premature end of track event");
			if (index === this.track.events.length - 1 && !(event instanceof EndOfTrackEvent_1.default)) throw new ValidationError_1.default("Expected end of track");
			if (event instanceof CopyrightEvent_1.default || event instanceof SequenceNumberEvent_1.default || event instanceof TrackNameEvent_1.default) this.validateZeroAbsoluteTime(index);
		}
		validateSize(size) {
			if (size > 4294967295) throw new ValidationError_1.default("Track size overflow");
		}
	};
	exports.default = TrackValidator;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/CallableArray.js
var require_CallableArray = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.adoptCallableArray = exports.createCallableArray = void 0;
	var backingSetters = /* @__PURE__ */ new WeakMap();
	/**
	* Wraps a plain array (or an Array subclass instance, e.g. TrackCollection) in a Proxy so it
	* remains usable as a normal array (indexing, length, iteration, push/forEach/etc via
	* delegation, instanceof via prototype delegation) but can also be invoked as a function to
	* replace its contents. Calling it returns `owner` (typed, so `instance.items(['a', 'b'])`
	* chains straight into `owner`'s other methods) rather than the array itself.
	*/
	function createCallableArray(owner, initial) {
		let backing = initial !== null && initial !== void 0 ? initial : [];
		const array = new Proxy(() => {}, {
			apply(_target, _thisArg, args) {
				const [value] = args;
				const resolved = typeof value === "function" ? value() : value;
				backing.length = 0;
				backing.push(...resolved);
				return owner;
			},
			get(_target, prop, receiver) {
				const value = Reflect.get(backing, prop, receiver);
				return typeof value === "function" ? value.bind(backing) : value;
			},
			set(_target, prop, value) {
				return Reflect.set(backing, prop, value);
			},
			has(_target, prop) {
				return Reflect.has(backing, prop);
			},
			deleteProperty(_target, prop) {
				return Reflect.deleteProperty(backing, prop);
			},
			ownKeys() {
				return Reflect.ownKeys(backing);
			},
			getOwnPropertyDescriptor(_target, prop) {
				return Reflect.getOwnPropertyDescriptor(backing, prop);
			},
			getPrototypeOf() {
				return Reflect.getPrototypeOf(backing);
			},
			setPrototypeOf(_target, proto) {
				return Reflect.setPrototypeOf(backing, proto);
			}
		});
		backingSetters.set(array, (next) => {
			backing = next;
		});
		return array;
	}
	exports.createCallableArray = createCallableArray;
	/**
	* Swaps the backing array/collection of a callable array created by createCallableArray,
	* in place, without recreating the Proxy - so a property can support `instance.prop = x`
	* reference-swap semantics (matching what a plain array field would do) while the callable
	* wrapper itself stays memoized (created once per instance, not once per access).
	*/
	function adoptCallableArray(array, next) {
		const setter = backingSetters.get(array);
		if (!setter) throw new TypeError("Value was not created by createCallableArray");
		setter(next);
	}
	exports.adoptCallableArray = adoptCallableArray;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/Track.js
var require_Track = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ParseError_1 = __importDefault(require_ParseError());
	var EventFactory_1 = __importDefault(require_EventFactory());
	var EndOfTrackEvent_1 = __importDefault(require_EndOfTrackEvent());
	var ControlEvent_1 = __importDefault(require_ControlEvent());
	var UnsupportedTrackError_1 = __importDefault(require_UnsupportedTrackError());
	var TrackValidator_1 = __importDefault(require_TrackValidator());
	var CallableArray_1 = require_CallableArray();
	var Probeable_1 = __importDefault(require_Probeable());
	var MTrk = 1297379947;
	var Track = class extends Probeable_1.default {
		constructor() {
			super(...arguments);
			this._eventsArray = (0, CallableArray_1.createCallableArray)(this);
		}
		get events() {
			return this._eventsArray;
		}
		set events(value) {
			(0, CallableArray_1.adoptCallableArray)(this._eventsArray, value);
		}
		readBytes(stream) {
			if (stream.readUint() !== MTrk) throw new UnsupportedTrackError_1.default(stream, "Expected MTrk, only MIDI tracks are supported presently");
			const chunkSize = stream.readUint();
			const status = [0, 0];
			let bytes = 0, cursor = 0, eot = false;
			let event;
			while (bytes < chunkSize) {
				if (eot) throw new ParseError_1.default(stream, "Unexpected end of track event");
				cursor = stream.getPosition();
				const delta = stream.readVLV();
				event = EventFactory_1.default.fromStream(stream, status, delta);
				if (!(event instanceof ControlEvent_1.default)) status[0] = status[1] = 0;
				if (event instanceof EndOfTrackEvent_1.default) eot = true;
				this.events.push(event);
				bytes += stream.getPosition() - cursor;
			}
			if (!eot) throw new ParseError_1.default(stream, "Expected end of track event");
			if (bytes < chunkSize) throw new ParseError_1.default(stream, "Expected bytes read to be equal to specified chunk size");
		}
		writeBytes(stream) {
			const validator = new TrackValidator_1.default(this);
			stream.writeUint(MTrk);
			const chunkSizePosition = stream.getPosition();
			stream.writeUint(0);
			const status = [0, 0];
			for (let i = 0; i < this.events.length; i++) {
				const event = this.events[i];
				validator.validateEvent(event, i);
				stream.writeVLV(event.delta);
				event.writeBytes(stream, status);
				if (!(event instanceof ControlEvent_1.default)) status[0] = status[1] = 0;
			}
			const trackEndPosition = stream.getPosition();
			const chunkSize = trackEndPosition - chunkSizePosition - 4;
			validator.validateSize(chunkSize);
			stream.seekTo(chunkSizePosition);
			stream.writeUint(chunkSize);
			stream.seekTo(trackEndPosition);
		}
		fixEndOfTrack() {
			const events = this.events;
			let accumulatedDelta = 0;
			for (let i = 0; i < events.length; i++) {
				const event = events[i];
				if (event instanceof EndOfTrackEvent_1.default) {
					accumulatedDelta += event.delta;
					continue;
				}
				event.delta += accumulatedDelta;
				accumulatedDelta = 0;
			}
			const filtered = events.filter((event) => !(event instanceof EndOfTrackEvent_1.default));
			filtered.push(new EndOfTrackEvent_1.default(accumulatedDelta));
			this.events(filtered);
			return this;
		}
	};
	exports.default = Track;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/streams/WriteStream.js
var require_WriteStream = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Stream_1 = __importDefault(require_Stream());
	var WriteStream = class extends Stream_1.default {
		constructor() {
			super();
			this.buffer = [];
		}
		writeByte(value) {
			this.buffer[this.position] = Number(value);
			this.position++;
		}
		writeSignedByte(value) {
			if (value < -128 || value > 127) throw new RangeError("Signed byte out of range");
			const normalized = Number(value);
			this.buffer[this.position] = normalized < 0 ? 255 + normalized : normalized;
			this.position++;
		}
		writeShort(value) {
			this.buffer[this.position] = (value & 65280) >> 8;
			this.buffer[this.position + 1] = value & 255;
			this.position += 2;
		}
		writeUint(value) {
			this.buffer[this.position] = (value & 4278190080) >> 24;
			this.buffer[this.position + 1] = (value & 16711680) >> 16;
			this.buffer[this.position + 2] = (value & 65280) >> 8;
			this.buffer[this.position + 3] = value & 255;
			this.position += 4;
		}
		writeVLV(value) {
			let buffer = value & 127;
			while ((value >>= 7) > 0) {
				buffer <<= 8;
				buffer |= 128;
				buffer += value & 127;
			}
			while (1) {
				this.writeByte(buffer);
				if (buffer & 128) buffer >>= 8;
				else break;
			}
		}
		seekTo(position) {
			if (!Number.isInteger(position)) throw new TypeError("Position must be an integer");
			if (position < 0 || position > this.buffer.length) throw new RangeError("Cannot seek to 0x" + position.toString(16));
			this.position = position;
		}
		toArrayBuffer() {
			const buffer = new ArrayBuffer(this.buffer.length);
			const dataView = new DataView(buffer);
			const length = this.buffer.length;
			for (let i = 0; i < length; i++) dataView.setUint8(i, this.buffer[i]);
			return buffer;
		}
		toDataUrl() {
			const buffer = this.toArrayBuffer();
			const bytes = new Uint8Array(buffer);
			const length = bytes.byteLength;
			let binary = "";
			for (let i = 0; i < length; i++) binary += String.fromCharCode(bytes[i]);
			return `data:audio/midi;base64,${btoa(binary)}`;
		}
		/**
		* @deprecated Use toDataUrl
		*/
		toDataURL() {
			return this.toDataUrl();
		}
	};
	exports.default = WriteStream;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/validators/FileValidator.js
var require_FileValidator = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var File_1 = require_File();
	var CopyrightEvent_1 = __importDefault(require_CopyrightEvent());
	var ValidationError_1 = __importDefault(require_ValidationError());
	var FileValidator = class {
		constructor(file) {
			this.file = file;
		}
		validateTrackCount() {
			if (this.file.format === File_1.Format.TYPE_0 && this.file.tracks.length > 1) throw new ValidationError_1.default("MIDI type 0 must have exactly one track");
			if (this.file.tracks.length > 65535) throw new ValidationError_1.default("Maximum number of tracks exceeded");
		}
		validateTrack(track, index) {
			if (index > 0) {
				if (track.events.find((event) => event instanceof CopyrightEvent_1.default)) throw new ValidationError_1.default("Event must be on first track");
			}
		}
	};
	exports.default = FileValidator;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/Resolution.js
var require_Resolution = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResolutionUnits = void 0;
	var FrameRate_1 = require_FrameRate();
	var ResolutionUnits;
	(function(ResolutionUnits) {
		ResolutionUnits["PPQ"] = "ppq";
		ResolutionUnits["FPS"] = "fps";
	})(ResolutionUnits || (exports.ResolutionUnits = ResolutionUnits = {}));
	var Resolution = class {
		constructor() {
			this.value = 480;
		}
		getFrameRateFromShort(value) {
			return (value & 32767) >> 8;
		}
		readBytes(stream) {
			const value = stream.readShort();
			if ((32768 & value) === 32768 && !(this.getFrameRateFromShort(value) in FrameRate_1.FrameRate)) throw new RangeError("Invalid frame rate");
			this.value = value;
		}
		writeBytes(stream) {
			stream.writeShort(this.value);
		}
		get units() {
			return (32768 & this.value) === 32768 ? ResolutionUnits.FPS : ResolutionUnits.PPQ;
		}
		get ticksPerQuarterNote() {
			if (this.units !== ResolutionUnits.PPQ) throw new Error("Cannot get PPQ from FPS resolution");
			return this.value;
		}
		set ticksPerQuarterNote(value) {
			if (value < 1) throw new RangeError("PPQ must be non-zero");
			if ((value & 32768) === 32768) throw new RangeError("PPQ cannot exceed 0x8000 (32,768)");
			if (!Number.isInteger(value)) throw new TypeError("PPQ must be an integer");
			this.value = value;
		}
		get framesPerSecond() {
			if (this.units !== ResolutionUnits.FPS) throw new Error("Cannot get FPS from PPQ resolution");
			return (this.value & 32767) >> 8;
		}
		set framesPerSecond(value) {
			if (this.units !== ResolutionUnits.FPS) throw new Error("Cannot set FPS on PPQ resolution, did you mean to use the setFps method?");
			this.setFps(value, this.ticksPerFrame);
		}
		get ticksPerFrame() {
			if (this.units !== ResolutionUnits.FPS) throw new Error("Cannot get ticks-per-frame from PPQ resolution");
			return this.value & 255;
		}
		set ticksPerFrame(value) {
			if (this.units !== ResolutionUnits.FPS) throw new Error("Cannot set ticks-per-frame on PPQ resolution, did you mean to use the setFps method?");
			this.setFps(this.framesPerSecond, value);
		}
		setFps(framesPerSecond, ticksPerFrame) {
			if (!(framesPerSecond in FrameRate_1.FrameRate)) throw new RangeError("Invalid frame rate");
			if (ticksPerFrame < 1) throw new RangeError("Ticks per frame must be non-zero");
			if (ticksPerFrame > 255) throw new RangeError("Ticks per frame cannot exceed 0xFF (255)");
			if (!Number.isInteger(ticksPerFrame)) throw new TypeError("Ticks per frame must be an integer");
			this.value = 32768 | 32512 & framesPerSecond << 8 | ticksPerFrame;
		}
	};
	exports.default = Resolution;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/TrackCollection.js
var require_TrackCollection = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var Track_1 = __importDefault(require_Track());
	var EndOfTrackEvent_1 = __importDefault(require_EndOfTrackEvent());
	var TrackCollection = class extends Array {
		/**
		* Flattens an array of two or more tracks into a single track, adjusting delta, stable by track order.
		*/
		flatten(options) {
			const { preserveEndOfTrackEvents = false, appendEndOfTrackEvent = true } = options !== null && options !== void 0 ? options : {};
			const totalCumulativeDelta = this.map(({ events }) => events.reduce((sum, { delta }) => sum + delta, 0));
			const longestTrackAbsolute = Math.max(...totalCumulativeDelta);
			const wrappers = [];
			if (preserveEndOfTrackEvents && appendEndOfTrackEvent) throw new Error("Cannot preserve end of track events and append end of track event, these parameters are mutually exclusive");
			this.forEach((track) => {
				let absolute = 0;
				track.events.forEach((event) => {
					if (!preserveEndOfTrackEvents && event instanceof EndOfTrackEvent_1.default) return;
					absolute += event.delta;
					wrappers.push({
						event,
						absolute
					});
				});
			});
			wrappers.sort((a, b) => a.absolute - b.absolute);
			let absolute = 0;
			const adjusted = wrappers.map((wrapper) => {
				wrapper.event.delta = wrapper.absolute - absolute;
				absolute = wrapper.absolute;
				return wrapper.event;
			});
			this.length = 0;
			const track = new Track_1.default();
			track.events = adjusted;
			if (appendEndOfTrackEvent) track.events.push(new EndOfTrackEvent_1.default(longestTrackAbsolute - absolute));
			this.push(track);
		}
	};
	exports.default = TrackCollection;
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/File.js
var require_File = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Format = void 0;
	var ReadStream_1 = __importDefault(require_ReadStream());
	var Track_1 = __importDefault(require_Track());
	var ParseError_1 = __importDefault(require_ParseError());
	var WriteStream_1 = __importDefault(require_WriteStream());
	var FileValidator_1 = __importDefault(require_FileValidator());
	var Resolution_1 = __importDefault(require_Resolution());
	var TrackCollection_1 = __importDefault(require_TrackCollection());
	var CallableArray_1 = require_CallableArray();
	var Probeable_1 = __importDefault(require_Probeable());
	var MThd = 1297377380;
	var Format;
	(function(Format) {
		Format[Format["TYPE_0"] = 0] = "TYPE_0";
		Format[Format["TYPE_1"] = 1] = "TYPE_1";
		Format[Format["TYPE_2"] = 2] = "TYPE_2";
	})(Format || (exports.Format = Format = {}));
	exports.default = class File extends Probeable_1.default {
		constructor() {
			super(...arguments);
			this._tracksArray = (0, CallableArray_1.createCallableArray)(this, new TrackCollection_1.default());
			this.format = Format.TYPE_1;
			this.resolution = new Resolution_1.default();
		}
		get tracks() {
			return this._tracksArray;
		}
		set tracks(value) {
			if (!(value instanceof TrackCollection_1.default)) Object.setPrototypeOf(value, TrackCollection_1.default.prototype);
			(0, CallableArray_1.adoptCallableArray)(this._tracksArray, value);
		}
		static fromArrayBuffer(data) {
			const file = new File();
			const stream = new ReadStream_1.default(data);
			file.readBytes(stream);
			return file;
		}
		static fromBinaryString(data) {
			const bytes = new Uint8Array(data.length);
			for (let i = 0; i < bytes.length; i++) bytes[i] = data.charCodeAt(i);
			return File.fromArrayBuffer(bytes.buffer);
		}
		static fromBase64(data) {
			return File.fromBinaryString(atob(data));
		}
		readHeader(stream) {
			if (stream.readUint() !== MThd) throw new ParseError_1.default(stream, "Expected MThd");
			if (stream.readUint() !== 6) throw new ParseError_1.default(stream, "Expected header size to be 6");
			this.format = stream.readShort();
			const numTracks = stream.readShort();
			this.resolution.readBytes(stream);
			return numTracks;
		}
		readBytes(stream) {
			const numTracks = this.readHeader(stream);
			this.tracks = new TrackCollection_1.default();
			for (let i = 0; i < numTracks; i++) {
				const track = new Track_1.default();
				track.readBytes(stream);
				this.tracks.push(track);
			}
			if (stream.getPosition() < stream.getLength()) throw new ParseError_1.default(stream, "Unexpected data after parsing file");
		}
		writeBytes(stream, trackWriteOptions = { autoEndOfTrackEvents: true }) {
			const validator = new FileValidator_1.default(this);
			stream.writeUint(MThd);
			stream.writeUint(6);
			validator.validateTrackCount();
			stream.writeShort(this.format);
			stream.writeShort(this.tracks.length);
			this.resolution.writeBytes(stream);
			for (let i = 0; i < this.tracks.length; i++) {
				const track = this.tracks[i];
				if (trackWriteOptions.autoEndOfTrackEvents) track.fixEndOfTrack();
				validator.validateTrack(track, i);
				track.writeBytes(stream);
			}
		}
		toArrayBuffer() {
			const stream = new WriteStream_1.default();
			this.writeBytes(stream);
			return stream.toArrayBuffer();
		}
	};
}));
//#endregion
//#region node_modules/@perry-rylance/midi/dist/events/factories/PitchBendRangeEventsFactory.js
var require_PitchBendRangeEventsFactory = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ControllerEvent_1 = __importStar(require_ControllerEvent());
	var PitchBendRangeEventsFactory = class {
		static create(channel, semitones, cents = 0) {
			const head = [
				new ControllerEvent_1.default(0, channel, ControllerEvent_1.NamedControllerType.REGISTERED_PARAMETER_FINE, 0),
				new ControllerEvent_1.default(0, channel, ControllerEvent_1.NamedControllerType.REGISTERED_PARAMETER_COARSE, 0),
				new ControllerEvent_1.default(0, channel, ControllerEvent_1.NamedControllerType.DATA_ENTRY_COARSE, semitones)
			];
			const tail = [new ControllerEvent_1.default(0, channel, ControllerEvent_1.NamedControllerType.REGISTERED_PARAMETER_FINE, 127), new ControllerEvent_1.default(0, channel, ControllerEvent_1.NamedControllerType.REGISTERED_PARAMETER_COARSE, 127)];
			if (cents) return [
				...head,
				new ControllerEvent_1.default(0, channel, ControllerEvent_1.NamedControllerType.DATA_ENTRY_FINE, cents),
				...tail
			];
			return [...head, ...tail];
		}
	};
	exports.default = PitchBendRangeEventsFactory;
}));
//#endregion
//#region src/ClockFrequencyHz.ts
var import_dist = (/* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Rate = exports.FrameRate = exports.MetaEventType = exports.Quality = exports.ProgramType = exports.ControllerType = exports.ControlEventType = exports.EventType = exports.Format = exports.WriteStream = exports.Stream = exports.ReadStream = exports.UnsupportedTrackError = exports.ParseError = exports.ParseControlEventError = exports.SysExEvent = exports.TrackNameEvent = exports.TimeSignatureEvent = exports.TextEvent = exports.SmtpeOffsetEvent = exports.SetTempoEvent = exports.SequencerSpecificEvent = exports.SequenceNumberEvent = exports.PortPrefixEvent = exports.MetaEvent = exports.MarkerEvent = exports.LyricEvent = exports.KeySignatureEvent = exports.InstrumentNameEvent = exports.EndOfTrackEvent = exports.CuePointEvent = exports.CopyrightEvent = exports.ChannelPrefixEvent = exports.MetaEventFactory = exports.EventFactory = exports.ControlEventFactory = exports.ProgramChangeEvent = exports.PitchWheelEvent = exports.NoteOnEvent = exports.NoteOffEvent = exports.NoteEvent = exports.ControllerEvent = exports.ControlEvent = exports.ChannelAftertouchEvent = exports.AftertouchEvent = exports.Event = exports.TrackCollection = exports.Track = exports.File = exports.DeviceManufacturer = void 0;
	exports.PitchBendRangeEventsFactory = exports.ResolutionUnits = exports.Resolution = exports.UniversalDevices = void 0;
	exports.DeviceManufacturer = __importDefault(require_DeviceManufacturer()).default;
	exports.File = __importDefault(require_File()).default;
	exports.Track = __importDefault(require_Track()).default;
	exports.TrackCollection = __importDefault(require_TrackCollection()).default;
	exports.Event = __importDefault(require_Event()).default;
	exports.AftertouchEvent = __importDefault(require_AftertouchEvent()).default;
	exports.ChannelAftertouchEvent = __importDefault(require_ChannelAftertouchEvent()).default;
	exports.ControlEvent = __importDefault(require_ControlEvent()).default;
	exports.ControllerEvent = __importDefault(require_ControllerEvent()).default;
	exports.NoteEvent = __importDefault(require_NoteEvent()).default;
	exports.NoteOffEvent = __importDefault(require_NoteOffEvent()).default;
	exports.NoteOnEvent = __importDefault(require_NoteOnEvent()).default;
	exports.PitchWheelEvent = __importDefault(require_PitchWheelEvent()).default;
	exports.ProgramChangeEvent = __importDefault(require_ProgramChangeEvent()).default;
	exports.ControlEventFactory = __importDefault(require_ControlEventFactory()).default;
	exports.EventFactory = __importDefault(require_EventFactory()).default;
	exports.MetaEventFactory = __importDefault(require_MetaEventFactory()).default;
	exports.ChannelPrefixEvent = __importDefault(require_ChannelPrefixEvent()).default;
	exports.CopyrightEvent = __importDefault(require_CopyrightEvent()).default;
	exports.CuePointEvent = __importDefault(require_CuePointEvent()).default;
	exports.EndOfTrackEvent = __importDefault(require_EndOfTrackEvent()).default;
	exports.InstrumentNameEvent = __importDefault(require_InstrumentNameEvent()).default;
	exports.KeySignatureEvent = __importDefault(require_KeySignatureEvent()).default;
	exports.LyricEvent = __importDefault(require_LyricEvent()).default;
	exports.MarkerEvent = __importDefault(require_MarkerEvent()).default;
	exports.MetaEvent = __importDefault(require_MetaEvent()).default;
	exports.PortPrefixEvent = __importDefault(require_PortPrefixEvent()).default;
	exports.SequenceNumberEvent = __importDefault(require_SequenceNumberEvent()).default;
	exports.SequencerSpecificEvent = __importDefault(require_SequencerSpecificEvent()).default;
	exports.SetTempoEvent = __importDefault(require_SetTempoEvent()).default;
	exports.SmtpeOffsetEvent = __importDefault(require_SmtpeOffsetEvent()).default;
	exports.TextEvent = __importDefault(require_TextEvent()).default;
	exports.TimeSignatureEvent = __importDefault(require_TimeSignatureEvent()).default;
	exports.TrackNameEvent = __importDefault(require_TrackNameEvent()).default;
	exports.SysExEvent = __importDefault(require_SysExEvent()).default;
	exports.ParseControlEventError = __importDefault(require_ParseControlEventError()).default;
	exports.ParseError = __importDefault(require_ParseError()).default;
	exports.UnsupportedTrackError = __importDefault(require_UnsupportedTrackError()).default;
	exports.ReadStream = __importDefault(require_ReadStream()).default;
	exports.Stream = __importDefault(require_Stream()).default;
	exports.WriteStream = __importDefault(require_WriteStream()).default;
	exports.PitchBendRangeEventsFactory = __importDefault(require_PitchBendRangeEventsFactory()).default;
	var File_2 = require_File();
	Object.defineProperty(exports, "Format", {
		enumerable: true,
		get: function() {
			return File_2.Format;
		}
	});
	var Event_2 = require_Event();
	Object.defineProperty(exports, "EventType", {
		enumerable: true,
		get: function() {
			return Event_2.EventType;
		}
	});
	var ControlEvent_2 = require_ControlEvent();
	Object.defineProperty(exports, "ControlEventType", {
		enumerable: true,
		get: function() {
			return ControlEvent_2.ControlEventType;
		}
	});
	var ControllerEvent_2 = require_ControllerEvent();
	Object.defineProperty(exports, "ControllerType", {
		enumerable: true,
		get: function() {
			return ControllerEvent_2.ControllerType;
		}
	});
	var ProgramChangeEvent_2 = require_ProgramChangeEvent();
	Object.defineProperty(exports, "ProgramType", {
		enumerable: true,
		get: function() {
			return ProgramChangeEvent_2.ProgramType;
		}
	});
	var KeySignatureEvent_2 = require_KeySignatureEvent();
	Object.defineProperty(exports, "Quality", {
		enumerable: true,
		get: function() {
			return KeySignatureEvent_2.Quality;
		}
	});
	var MetaEvent_2 = require_MetaEvent();
	Object.defineProperty(exports, "MetaEventType", {
		enumerable: true,
		get: function() {
			return MetaEvent_2.MetaEventType;
		}
	});
	var FrameRate_1 = require_FrameRate();
	Object.defineProperty(exports, "FrameRate", {
		enumerable: true,
		get: function() {
			return FrameRate_1.FrameRate;
		}
	});
	Object.defineProperty(exports, "Rate", {
		enumerable: true,
		get: function() {
			return FrameRate_1.FrameRate;
		}
	});
	var SysExEvent_2 = require_SysExEvent();
	Object.defineProperty(exports, "UniversalDevices", {
		enumerable: true,
		get: function() {
			return SysExEvent_2.UniversalDevices;
		}
	});
	var Resolution_1 = __importStar(require_Resolution());
	exports.Resolution = Resolution_1.default;
	Object.defineProperty(exports, "ResolutionUnits", {
		enumerable: true,
		get: function() {
			return Resolution_1.ResolutionUnits;
		}
	});
})))();
var ClockFrequencyHz_exports = /* @__PURE__ */ __exportAll({
	Ntsc: () => Ntsc,
	Pal: () => Pal
});
var Pal = 985248;
var Ntsc = 1022727;
//#endregion
//#region src/ContinuousController.ts
var ContinuousController = {
	PulseWidth: 75,
	Attack: 76,
	Decay: 77,
	Sustain: 78,
	Release: 79,
	Tri: 80,
	Saw: 81,
	Pulse: 82,
	Noise: 83,
	Gate: 84,
	Sync: 85,
	Ring: 86,
	Test: 87,
	FilterCutoff: 74,
	FilterResonance: 71,
	FilterEnable: 88,
	FilterLowPass: 89,
	FilterBandPass: 90,
	FilterHighPass: 91,
	Oscillator3Mute: 92,
	AdsrWorkaroundGlobal: 93,
	AdsrWorkaroundChannel: 94,
	MainVolume: 7
};
//#endregion
//#region src/MidiInterpreter.ts
var { Attack, Decay, PulseWidth, Release, Sustain, Tri, Saw, Pulse, Noise, Gate, Sync, Ring, Test, FilterCutoff, FilterResonance, FilterEnable, FilterLowPass, FilterBandPass, FilterHighPass, Oscillator3Mute, MainVolume, AdsrWorkaroundGlobal, AdsrWorkaroundChannel } = ContinuousController;
var MidiInterpreter = class {
	sid;
	clockFrequencyHz;
	pcmFrequencyHz = 44100;
	attackDecay = new Uint8Array(3);
	sustainRelease = new Uint8Array(3);
	controlRegister = new Uint8Array(3);
	controlRegisterDirty = [
		false,
		false,
		false
	];
	lastPressedKey = [
		null,
		null,
		null
	];
	filterResonanceSelect = 0;
	filterModeVolumeSelect = 0;
	adsrWorkaroundGlobalEnabled = false;
	adsrWorkaroundChannelEnabled = [
		false,
		false,
		false
	];
	pendingAdsrRelease = [
		false,
		false,
		false
	];
	rpnMsb = new Uint8Array([
		127,
		127,
		127
	]);
	rpnLsb = new Uint8Array([
		127,
		127,
		127
	]);
	maxBendSemitones = new Uint8Array([
		2,
		2,
		2
	]);
	pitchBendAmount = new Float32Array(3);
	constructor(sid, clockFrequencyHz = Pal, initialControlRegister = 0, initialSustainRelease = 0, initialFilterModeVolumeSelect = 0) {
		this.sid = sid;
		this.clockFrequencyHz = clockFrequencyHz;
		this.sid.setSamplingParameters(this.clockFrequencyHz, 0, this.pcmFrequencyHz);
		for (let channel = 0; channel < 3; channel++) {
			this.controlRegister[channel] = initialControlRegister;
			this.sustainRelease[channel] = initialSustainRelease;
		}
		this.filterModeVolumeSelect = initialFilterModeVolumeSelect;
	}
	getExtrapolatedBitValue(value, inBits, outBits) {
		const maxIn = (1 << inBits) - 1;
		const maxOut = (1 << outBits) - 1;
		if (maxIn <= 0) return 0;
		return Math.round(value / maxIn * maxOut);
	}
	updateFrequency(channel) {
		const key = this.lastPressedKey[channel];
		if (key === null) return;
		const bentKey = key + this.pitchBendAmount[channel] * this.maxBendSemitones[channel];
		const frequencyHz = 440 * Math.pow(2, (bentKey - 69) / 12);
		const regValue = Math.round(frequencyHz * 16777216 / this.clockFrequencyHz);
		const clamped = Math.max(0, Math.min(65535, regValue));
		const offset = channel * 7;
		const lo = clamped & 255;
		const hi = clamped >> 8 & 255;
		this.sid.write(offset + 0, lo);
		this.sid.write(offset + 1, hi);
	}
	processNoteOn(event) {
		if (event.channel > 2) return;
		this.lastPressedKey[event.channel] = event.key;
		this.updateFrequency(event.channel);
		const offset = event.channel * 7;
		if (this.adsrWorkaroundGlobalEnabled && this.adsrWorkaroundChannelEnabled[event.channel]) {
			this.pendingAdsrRelease[event.channel] = true;
			this.sid.write(offset + 4, 0);
			this.sid.write(offset + 5, 0);
			this.sid.write(offset + 6, 240);
		} else if (this.controlRegister[event.channel] & 1) this.sid.write(offset + 4, this.controlRegister[event.channel] & -2);
		this.controlRegister[event.channel] |= 1;
		this.sid.write(offset + 4, this.controlRegister[event.channel]);
		this.controlRegisterDirty[event.channel] = false;
	}
	processPitchWheel(event) {
		if (event.channel > 2) return;
		this.pitchBendAmount[event.channel] = event.amount;
		this.updateFrequency(event.channel);
	}
	processNoteOff(event) {
		if (event.channel > 2) return;
		if (this.lastPressedKey[event.channel] === event.key) {
			const offset = event.channel * 7;
			this.controlRegister[event.channel] &= -2;
			if (this.pendingAdsrRelease[event.channel]) {
				this.sid.write(offset + 5, this.attackDecay[event.channel]);
				this.sid.write(offset + 6, this.sustainRelease[event.channel]);
				this.pendingAdsrRelease[event.channel] = false;
			}
			this.sid.write(offset + 4, this.controlRegister[event.channel]);
			this.controlRegisterDirty[event.channel] = false;
			this.lastPressedKey[event.channel] = null;
		}
	}
	hasPendingAdsrRelease(channel) {
		return this.pendingAdsrRelease[channel];
	}
	releaseAdsrHold(channel) {
		if (!this.pendingAdsrRelease[channel]) return;
		const offset = channel * 7;
		this.sid.write(offset + 5, this.attackDecay[channel]);
		this.sid.write(offset + 6, this.sustainRelease[channel]);
		this.pendingAdsrRelease[channel] = false;
	}
	isAdsrWorkaroundGlobalEnabled() {
		return this.adsrWorkaroundGlobalEnabled;
	}
	isAdsrWorkaroundEnabledForChannel(channel) {
		return this.adsrWorkaroundChannelEnabled[channel];
	}
	processController(event) {
		switch (Number(event.controller)) {
			case FilterCutoff: {
				const mapped = this.getExtrapolatedBitValue(event.value, 7, 11);
				const lo = mapped & 7;
				const hi = mapped >> 3 & 255;
				this.sid.write(21, lo);
				this.sid.write(22, hi);
				break;
			}
			case FilterResonance: {
				const mapped = this.getExtrapolatedBitValue(event.value, 7, 4);
				this.filterResonanceSelect = this.filterResonanceSelect & 15 | mapped << 4;
				this.sid.write(23, this.filterResonanceSelect);
				break;
			}
			case FilterEnable: {
				const on = event.value >= 64;
				const mask = 1 << event.channel;
				this.filterResonanceSelect = on ? this.filterResonanceSelect | mask : this.filterResonanceSelect & ~mask;
				this.sid.write(23, this.filterResonanceSelect);
				break;
			}
			case FilterLowPass:
			case FilterBandPass:
			case FilterHighPass:
			case Oscillator3Mute: {
				const on = event.value >= 64;
				const mask = {
					[FilterLowPass]: 16,
					[FilterBandPass]: 32,
					[FilterHighPass]: 64,
					[Oscillator3Mute]: 128
				}[event.controller];
				this.filterModeVolumeSelect = on ? this.filterModeVolumeSelect | mask : this.filterModeVolumeSelect & ~mask;
				this.sid.write(24, this.filterModeVolumeSelect);
				break;
			}
			case MainVolume: {
				const mapped = this.getExtrapolatedBitValue(event.value, 7, 4);
				this.filterModeVolumeSelect = this.filterModeVolumeSelect & 240 | mapped;
				this.sid.write(24, this.filterModeVolumeSelect);
				break;
			}
			case PulseWidth:
				if (event.channel > 2) return;
				const mapped = this.getExtrapolatedBitValue(event.value, 7, 12);
				const offset = event.channel * 7 + 2;
				const lo = mapped & 255;
				const hi = mapped >> 8 & 255;
				this.sid.write(offset + 0, lo);
				this.sid.write(offset + 1, hi);
				break;
			case Attack:
			case Decay:
			case Sustain:
			case Release: {
				if (event.channel > 2) return;
				const mapped = this.getExtrapolatedBitValue(event.value, 7, 4);
				const { array, shift, mask, regOffset } = {
					[Attack]: {
						array: this.attackDecay,
						shift: 4,
						mask: 15,
						regOffset: 5
					},
					[Decay]: {
						array: this.attackDecay,
						shift: 0,
						mask: 240,
						regOffset: 5
					},
					[Sustain]: {
						array: this.sustainRelease,
						shift: 4,
						mask: 15,
						regOffset: 6
					},
					[Release]: {
						array: this.sustainRelease,
						shift: 0,
						mask: 240,
						regOffset: 6
					}
				}[event.controller];
				const address = event.channel * 7 + regOffset;
				const newVal = array[event.channel] & mask | mapped << shift;
				array[event.channel] = newVal;
				this.sid.write(address, newVal);
				break;
			}
			case Tri:
			case Saw:
			case Pulse:
			case Noise:
			case Gate:
			case Sync:
			case Ring:
			case Test: {
				if (event.channel > 2) return;
				const on = event.value >= 64;
				const mask = {
					[Gate]: 1,
					[Sync]: 2,
					[Ring]: 4,
					[Test]: 8,
					[Tri]: 16,
					[Saw]: 32,
					[Pulse]: 64,
					[Noise]: 128
				}[event.controller];
				const currentVal = this.controlRegister[event.channel];
				const newVal = on ? currentVal | mask : currentVal & ~mask;
				this.controlRegister[event.channel] = newVal;
				this.controlRegisterDirty[event.channel] = true;
				break;
			}
			case AdsrWorkaroundGlobal:
				this.adsrWorkaroundGlobalEnabled = event.value >= 64;
				break;
			case AdsrWorkaroundChannel:
				if (event.channel > 2) return;
				this.adsrWorkaroundChannelEnabled[event.channel] = event.value >= 64;
				break;
			case 101:
				if (event.channel > 2) return;
				this.rpnMsb[event.channel] = event.value;
				break;
			case 100:
				if (event.channel > 2) return;
				this.rpnLsb[event.channel] = event.value;
				break;
			case 6:
				if (event.channel > 2) return;
				if (this.rpnMsb[event.channel] === 0 && this.rpnLsb[event.channel] === 0) this.maxBendSemitones[event.channel] = event.value;
				break;
		}
	}
	flush() {
		for (let channel = 0; channel < 3; channel++) if (this.controlRegisterDirty[channel]) {
			this.sid.write(channel * 7 + 4, this.controlRegister[channel]);
			this.controlRegisterDirty[channel] = false;
		}
	}
	process(event) {
		if (event instanceof import_dist.ControllerEvent) return this.processController(event);
		if (event instanceof import_dist.NoteOnEvent) return this.processNoteOn(event);
		if (event instanceof import_dist.NoteOffEvent) return this.processNoteOff(event);
		if (event instanceof import_dist.PitchWheelEvent) return this.processPitchWheel(event);
	}
};
//#endregion
//#region src/SidChipAdapter.ts
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
var SidChipAdapter = class SidChipAdapter {
	sid;
	static DEFAULT_CONTROL_REGISTER = 32;
	static DEFAULT_SUSTAIN_RELEASE = 240;
	static DEFAULT_FILTER_MODE_VOLUME = 15;
	constructor(sid) {
		this.sid = sid;
		for (let i = 0; i < 18; i++) this.write(i, 0);
		for (let i = 0; i < 3; i++) {
			this.write(7 * i + 4, SidChipAdapter.DEFAULT_CONTROL_REGISTER);
			this.write(7 * i + 6, SidChipAdapter.DEFAULT_SUSTAIN_RELEASE);
		}
		this.write(24, SidChipAdapter.DEFAULT_FILTER_MODE_VOLUME);
	}
	setChipModel(model) {
		this.sid.setChipModel(model);
	}
	getChipModel() {
		return this.sid.getChipModel();
	}
	setCombinedWaveforms(cws) {
		this.sid.setCombinedWaveforms(cws);
	}
	reset() {
		this.sid.reset();
	}
	input(value) {
		this.sid.input(value);
	}
	read(offset) {
		return this.sid.read(offset);
	}
	write(offset, value) {
		this.sid.write(offset, value);
	}
	setSamplingParameters(clockFrequency, method, samplingFrequency) {
		this.sid.setSamplingParameters(clockFrequency, method, samplingFrequency);
	}
	clock(a, b) {
		return this.sid.clock(a, b);
	}
	clockSilent(cycles) {
		this.sid.clockSilent(cycles);
	}
	setFilter6581Curve(filterCurve) {
		this.sid.setFilter6581Curve(filterCurve);
	}
	setFilter6581Range(adjustment) {
		this.sid.setFilter6581Range(adjustment);
	}
	setFilter8580Curve(filterCurve) {
		this.sid.setFilter8580Curve(filterCurve);
	}
	enableFilter(enable) {
		this.sid.enableFilter(enable);
	}
	enableOld6581caps(enable) {
		this.sid.enableOld6581caps(enable);
	}
	delete() {
		this.sid.delete();
	}
};
//#endregion
//#region src/Processor.ts
var Processor = class Processor {
	sid;
	midi;
	sampleRate;
	clockFrequencyHz;
	static holdDurationMs = 30;
	bpm = 120;
	buffer = new Int16Array();
	interpreter;
	nextEventIndex = 0;
	accumulatedDeltaSamples = 0;
	idealElapsedSeconds = 0;
	roundedElapsedSamples = 0;
	currentEventTotalSamples = null;
	holdSamples;
	releaseAtSample = [
		null,
		null,
		null
	];
	totalSamplesClocked = 0;
	constructor(sid, midi, sampleRate = 44100, clockFrequencyHz = Pal) {
		this.sid = sid;
		this.midi = midi;
		this.sampleRate = sampleRate;
		this.clockFrequencyHz = clockFrequencyHz;
		if (midi.tracks.length !== 1) throw new Error("Expected only 1 track");
		this.interpreter = new MidiInterpreter(this.sid, this.clockFrequencyHz, SidChipAdapter.DEFAULT_CONTROL_REGISTER, SidChipAdapter.DEFAULT_SUSTAIN_RELEASE, SidChipAdapter.DEFAULT_FILTER_MODE_VOLUME);
		this.holdSamples = Math.round(Processor.holdDurationMs / 1e3 * this.sampleRate);
	}
	getInterpreter() {
		return this.interpreter;
	}
	getNumSamplesFromDelta(delta) {
		if (this.currentEventTotalSamples !== null) return this.currentEventTotalSamples;
		const deltaInSeconds = delta / this.midi.resolution.ticksPerQuarterNote * (60 / this.bpm);
		this.idealElapsedSeconds += deltaInSeconds;
		const newRoundedElapsedSamples = Math.round(this.idealElapsedSeconds * this.sampleRate);
		this.currentEventTotalSamples = newRoundedElapsedSamples - this.roundedElapsedSamples;
		this.roundedElapsedSamples = newRoundedElapsedSamples;
		return this.currentEventTotalSamples;
	}
	clockAndWrite(buffer, outputStart, numSamples) {
		this.interpreter.flush();
		this.sid.clock(this.buffer, numSamples);
		buffer.set(this.buffer.subarray(0, numSamples), outputStart);
		this.totalSamplesClocked += numSamples;
	}
	clockRespectingPendingReleases(buffer, outputStart, numSamples) {
		let clocked = 0;
		while (clocked < numSamples) {
			let chunk = numSamples - clocked;
			for (let channel = 0; channel < 3; channel++) {
				const releaseAt = this.releaseAtSample[channel];
				if (releaseAt === null) continue;
				const samplesUntilRelease = releaseAt - this.totalSamplesClocked;
				if (samplesUntilRelease < chunk) chunk = Math.max(0, samplesUntilRelease);
			}
			if (chunk > 0) this.clockAndWrite(buffer, outputStart + clocked, chunk);
			clocked += chunk;
			for (let channel = 0; channel < 3; channel++) if (this.releaseAtSample[channel] === this.totalSamplesClocked) {
				this.interpreter.releaseAdsrHold(channel);
				this.releaseAtSample[channel] = null;
			}
		}
	}
	process(buffer, size, loop = false) {
		if (!size) size = buffer.length;
		if (size > this.buffer.length) this.buffer = new Int16Array(size);
		const track = this.midi.tracks[0];
		if (this.nextEventIndex >= track.events.length) return 0;
		let numSamplesWritten = 0;
		while (this.nextEventIndex < track.events.length) {
			if (numSamplesWritten >= size) break;
			const event = track.events[this.nextEventIndex];
			const remainingDeltaSamples = this.getNumSamplesFromDelta(event.delta) - this.accumulatedDeltaSamples;
			const remainingBufferSamples = size - numSamplesWritten;
			if (remainingDeltaSamples > 0 && remainingBufferSamples > 0) if (remainingDeltaSamples > remainingBufferSamples) {
				this.accumulatedDeltaSamples += remainingBufferSamples;
				this.clockRespectingPendingReleases(buffer, numSamplesWritten, remainingBufferSamples);
				numSamplesWritten += remainingBufferSamples;
				break;
			} else {
				this.accumulatedDeltaSamples = 0;
				this.clockRespectingPendingReleases(buffer, numSamplesWritten, remainingDeltaSamples);
				numSamplesWritten += remainingDeltaSamples;
			}
			if (event instanceof import_dist.SetTempoEvent) this.bpm = event.bpm;
			else {
				this.interpreter.process(event);
				if (event instanceof import_dist.NoteOnEvent && event.channel <= 2 && this.interpreter.hasPendingAdsrRelease(event.channel)) this.releaseAtSample[event.channel] = this.totalSamplesClocked + this.holdSamples;
			}
			this.currentEventTotalSamples = null;
			if (loop) this.nextEventIndex = (this.nextEventIndex + 1) % track.events.length;
			else this.nextEventIndex++;
		}
		return numSamplesWritten;
	}
};
//#endregion
//#region src/index.ts
var import_libresidfp = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Module = (() => {
		var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
		if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
		return (function(Module) {
			Module = Module || {};
			var Module = typeof Module != "undefined" ? Module : {};
			var readyPromiseResolve, readyPromiseReject;
			Module["ready"] = new Promise(function(resolve, reject) {
				readyPromiseResolve = resolve;
				readyPromiseReject = reject;
			});
			var moduleOverrides = Object.assign({}, Module);
			var arguments_ = [];
			var ENVIRONMENT_IS_WEB = typeof window == "object";
			var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
			var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
			var scriptDirectory = "";
			function locateFile(path) {
				if (Module["locateFile"]) return Module["locateFile"](path, scriptDirectory);
				return scriptDirectory + path;
			}
			var read_, readAsync, readBinary;
			var fs;
			var nodePath;
			var requireNodeFS;
			if (ENVIRONMENT_IS_NODE) {
				if (ENVIRONMENT_IS_WORKER) scriptDirectory = require("path").dirname(scriptDirectory) + "/";
				else scriptDirectory = __dirname + "/";
				requireNodeFS = (() => {
					if (!nodePath) {
						fs = require("fs");
						nodePath = require("path");
					}
				});
				read_ = function shell_read(filename, binary) {
					var ret = tryParseAsDataURI(filename);
					if (ret) return binary ? ret : ret.toString();
					requireNodeFS();
					filename = nodePath["normalize"](filename);
					return fs.readFileSync(filename, binary ? void 0 : "utf8");
				};
				readBinary = ((filename) => {
					var ret = read_(filename, true);
					if (!ret.buffer) ret = new Uint8Array(ret);
					return ret;
				});
				readAsync = ((filename, onload, onerror) => {
					var ret = tryParseAsDataURI(filename);
					if (ret) onload(ret);
					requireNodeFS();
					filename = nodePath["normalize"](filename);
					fs.readFile(filename, function(err, data) {
						if (err) onerror(err);
						else onload(data.buffer);
					});
				});
				if (process["argv"].length > 1) process["argv"][1].replace(/\\/g, "/");
				arguments_ = process["argv"].slice(2);
				process["on"]("uncaughtException", function(ex) {
					if (!(ex instanceof ExitStatus)) throw ex;
				});
				process["on"]("unhandledRejection", function(reason) {
					throw reason;
				});
				Module["inspect"] = function() {
					return "[Emscripten Module object]";
				};
			} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
				if (ENVIRONMENT_IS_WORKER) scriptDirectory = self.location.href;
				else if (typeof document != "undefined" && document.currentScript) scriptDirectory = document.currentScript.src;
				if (_scriptDir) scriptDirectory = _scriptDir;
				if (scriptDirectory.indexOf("blob:") !== 0) scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
				else scriptDirectory = "";
				read_ = ((url) => {
					try {
						var xhr = new XMLHttpRequest();
						xhr.open("GET", url, false);
						xhr.send(null);
						return xhr.responseText;
					} catch (err) {
						var data = tryParseAsDataURI(url);
						if (data) return intArrayToString(data);
						throw err;
					}
				});
				if (ENVIRONMENT_IS_WORKER) readBinary = ((url) => {
					try {
						var xhr = new XMLHttpRequest();
						xhr.open("GET", url, false);
						xhr.responseType = "arraybuffer";
						xhr.send(null);
						return new Uint8Array(xhr.response);
					} catch (err) {
						var data = tryParseAsDataURI(url);
						if (data) return data;
						throw err;
					}
				});
				readAsync = ((url, onload, onerror) => {
					var xhr = new XMLHttpRequest();
					xhr.open("GET", url, true);
					xhr.responseType = "arraybuffer";
					xhr.onload = (() => {
						if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
							onload(xhr.response);
							return;
						}
						var data = tryParseAsDataURI(url);
						if (data) {
							onload(data.buffer);
							return;
						}
						onerror();
					});
					xhr.onerror = onerror;
					xhr.send(null);
				});
			}
			Module["print"] || console.log.bind(console);
			var err = Module["printErr"] || console.warn.bind(console);
			Object.assign(Module, moduleOverrides);
			moduleOverrides = null;
			if (Module["arguments"]) arguments_ = Module["arguments"];
			if (Module["thisProgram"]) Module["thisProgram"];
			if (Module["quit"]) Module["quit"];
			var wasmBinary;
			if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
			Module["noExitRuntime"];
			if (typeof WebAssembly != "object") abort("no native wasm support detected");
			var wasmMemory;
			var ABORT = false;
			function assert(condition, text) {
				if (!condition) abort(text);
			}
			var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
			function UTF8ArrayToString(heap, idx, maxBytesToRead) {
				var endIdx = idx + maxBytesToRead;
				var endPtr = idx;
				while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
				if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) return UTF8Decoder.decode(heap.subarray(idx, endPtr));
				else {
					var str = "";
					while (idx < endPtr) {
						var u0 = heap[idx++];
						if (!(u0 & 128)) {
							str += String.fromCharCode(u0);
							continue;
						}
						var u1 = heap[idx++] & 63;
						if ((u0 & 224) == 192) {
							str += String.fromCharCode((u0 & 31) << 6 | u1);
							continue;
						}
						var u2 = heap[idx++] & 63;
						if ((u0 & 240) == 224) u0 = (u0 & 15) << 12 | u1 << 6 | u2;
						else u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63;
						if (u0 < 65536) str += String.fromCharCode(u0);
						else {
							var ch = u0 - 65536;
							str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
						}
					}
				}
				return str;
			}
			function UTF8ToString(ptr, maxBytesToRead) {
				return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
			}
			function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
				if (!(maxBytesToWrite > 0)) return 0;
				var startIdx = outIdx;
				var endIdx = outIdx + maxBytesToWrite - 1;
				for (var i = 0; i < str.length; ++i) {
					var u = str.charCodeAt(i);
					if (u >= 55296 && u <= 57343) {
						var u1 = str.charCodeAt(++i);
						u = 65536 + ((u & 1023) << 10) | u1 & 1023;
					}
					if (u <= 127) {
						if (outIdx >= endIdx) break;
						heap[outIdx++] = u;
					} else if (u <= 2047) {
						if (outIdx + 1 >= endIdx) break;
						heap[outIdx++] = 192 | u >> 6;
						heap[outIdx++] = 128 | u & 63;
					} else if (u <= 65535) {
						if (outIdx + 2 >= endIdx) break;
						heap[outIdx++] = 224 | u >> 12;
						heap[outIdx++] = 128 | u >> 6 & 63;
						heap[outIdx++] = 128 | u & 63;
					} else {
						if (outIdx + 3 >= endIdx) break;
						heap[outIdx++] = 240 | u >> 18;
						heap[outIdx++] = 128 | u >> 12 & 63;
						heap[outIdx++] = 128 | u >> 6 & 63;
						heap[outIdx++] = 128 | u & 63;
					}
				}
				heap[outIdx] = 0;
				return outIdx - startIdx;
			}
			function stringToUTF8(str, outPtr, maxBytesToWrite) {
				return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
			}
			function lengthBytesUTF8(str) {
				var len = 0;
				for (var i = 0; i < str.length; ++i) {
					var u = str.charCodeAt(i);
					if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
					if (u <= 127) ++len;
					else if (u <= 2047) len += 2;
					else if (u <= 65535) len += 3;
					else len += 4;
				}
				return len;
			}
			var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : void 0;
			function UTF16ToString(ptr, maxBytesToRead) {
				var endPtr = ptr;
				var idx = endPtr >> 1;
				var maxIdx = idx + maxBytesToRead / 2;
				while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
				endPtr = idx << 1;
				if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
				else {
					var str = "";
					for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
						var codeUnit = HEAP16[ptr + i * 2 >> 1];
						if (codeUnit == 0) break;
						str += String.fromCharCode(codeUnit);
					}
					return str;
				}
			}
			function stringToUTF16(str, outPtr, maxBytesToWrite) {
				if (maxBytesToWrite === void 0) maxBytesToWrite = 2147483647;
				if (maxBytesToWrite < 2) return 0;
				maxBytesToWrite -= 2;
				var startPtr = outPtr;
				var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
				for (var i = 0; i < numCharsToWrite; ++i) {
					var codeUnit = str.charCodeAt(i);
					HEAP16[outPtr >> 1] = codeUnit;
					outPtr += 2;
				}
				HEAP16[outPtr >> 1] = 0;
				return outPtr - startPtr;
			}
			function lengthBytesUTF16(str) {
				return str.length * 2;
			}
			function UTF32ToString(ptr, maxBytesToRead) {
				var i = 0;
				var str = "";
				while (!(i >= maxBytesToRead / 4)) {
					var utf32 = HEAP32[ptr + i * 4 >> 2];
					if (utf32 == 0) break;
					++i;
					if (utf32 >= 65536) {
						var ch = utf32 - 65536;
						str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
					} else str += String.fromCharCode(utf32);
				}
				return str;
			}
			function stringToUTF32(str, outPtr, maxBytesToWrite) {
				if (maxBytesToWrite === void 0) maxBytesToWrite = 2147483647;
				if (maxBytesToWrite < 4) return 0;
				var startPtr = outPtr;
				var endPtr = startPtr + maxBytesToWrite - 4;
				for (var i = 0; i < str.length; ++i) {
					var codeUnit = str.charCodeAt(i);
					if (codeUnit >= 55296 && codeUnit <= 57343) {
						var trailSurrogate = str.charCodeAt(++i);
						codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
					}
					HEAP32[outPtr >> 2] = codeUnit;
					outPtr += 4;
					if (outPtr + 4 > endPtr) break;
				}
				HEAP32[outPtr >> 2] = 0;
				return outPtr - startPtr;
			}
			function lengthBytesUTF32(str) {
				var len = 0;
				for (var i = 0; i < str.length; ++i) {
					var codeUnit = str.charCodeAt(i);
					if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
					len += 4;
				}
				return len;
			}
			var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
			function updateGlobalBufferAndViews(buf) {
				buffer = buf;
				Module["HEAP8"] = HEAP8 = new Int8Array(buf);
				Module["HEAP16"] = HEAP16 = new Int16Array(buf);
				Module["HEAP32"] = HEAP32 = new Int32Array(buf);
				Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
				Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
				Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
				Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
				Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
			}
			Module["INITIAL_MEMORY"];
			var wasmTable;
			var __ATPRERUN__ = [];
			var __ATINIT__ = [];
			var __ATPOSTRUN__ = [];
			function preRun() {
				if (Module["preRun"]) {
					if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
					while (Module["preRun"].length) addOnPreRun(Module["preRun"].shift());
				}
				callRuntimeCallbacks(__ATPRERUN__);
			}
			function initRuntime() {
				callRuntimeCallbacks(__ATINIT__);
			}
			function postRun() {
				if (Module["postRun"]) {
					if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
					while (Module["postRun"].length) addOnPostRun(Module["postRun"].shift());
				}
				callRuntimeCallbacks(__ATPOSTRUN__);
			}
			function addOnPreRun(cb) {
				__ATPRERUN__.unshift(cb);
			}
			function addOnInit(cb) {
				__ATINIT__.unshift(cb);
			}
			function addOnPostRun(cb) {
				__ATPOSTRUN__.unshift(cb);
			}
			var runDependencies = 0;
			var runDependencyWatcher = null;
			var dependenciesFulfilled = null;
			function addRunDependency(id) {
				runDependencies++;
				if (Module["monitorRunDependencies"]) Module["monitorRunDependencies"](runDependencies);
			}
			function removeRunDependency(id) {
				runDependencies--;
				if (Module["monitorRunDependencies"]) Module["monitorRunDependencies"](runDependencies);
				if (runDependencies == 0) {
					if (runDependencyWatcher !== null) {
						clearInterval(runDependencyWatcher);
						runDependencyWatcher = null;
					}
					if (dependenciesFulfilled) {
						var callback = dependenciesFulfilled;
						dependenciesFulfilled = null;
						callback();
					}
				}
			}
			Module["preloadedImages"] = {};
			Module["preloadedAudios"] = {};
			function abort(what) {
				if (Module["onAbort"]) Module["onAbort"](what);
				what = "Aborted(" + what + ")";
				err(what);
				ABORT = true;
				what += ". Build with -s ASSERTIONS=1 for more info.";
				var e = new WebAssembly.RuntimeError(what);
				readyPromiseReject(e);
				throw e;
			}
			var dataURIPrefix = "data:application/octet-stream;base64,";
			function isDataURI(filename) {
				return filename.startsWith(dataURIPrefix);
			}
			function isFileURI(filename) {
				return filename.startsWith("file://");
			}
			var wasmBinaryFile = "data:application/octet-stream;base64,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IABBFzYCAEGMGkHJCEEDQZgcQfAaQRggAEEAEAJBCBAgIgBBADYCBCAAQRk2AgBBjBpB4A5BA0GkHEGwHEEaIABBABACQQgQICIAQQA2AgQgAEEbNgIAQYwaQdIPQQNBpBxBsBxBGiAAQQAQAkEIECAiAEEANgIEIABBHDYCAEGMGkHzDkEDQaQcQbAcQRogAEEAEAJBCBAgIgBBADYCBCAAQR02AgBBjBpB3wlBA0G4HEHwGkEeIABBABACQQgQICIAQQA2AgQgAEEfNgIAQYwaQbEJQQNBuBxB8BpBHiAAQQAQAkGMiAFCADcCAEGIiAFBjIgBNgIAEHQL1hoCC38pfSMAQfAAayIDJAAgAUEAR0H4AGxBgC9BkC1BoCsgAkEBRhsgAkECRhtqIQdBjIgBIQECQAJAAkBBjIgBKAIAIgJFDQADQCABIAIgAigCECAHSSIEGyEBIAJBBGogAiAEGygCACICDQALIAFBjIgBIgRGDQEgByABKAIQSQ0AIAAgASgCFDYCACAAIAEoAhgiADYCBCAARQ0CIAAgACgCBEEBajYCBAwCCyABIQQLQRgQICIIQfgwNgIAIAhCADcCBEGAwAIQICEKIAhChYCAgICABDcCECAIIAo2AgwgCEEMaiELA0AgA0GAgID8AzYCMCADIAcgCUEYbGoiAioCECIPQQwgAigCACIBEQIAOAIAIAMgAioCFCIOQQwgARECADgCYCADIA9BCyABEQIAOAIEIAMgDkELIAERAgA4AlwgAyAPQQogARECADgCCCADIA5BCiABEQIAOAJYIAMgD0EJIAERAgA4AgwgAyAOQQkgARECADgCVCADIA9BCCABEQIAOAIQIAMgDkEIIAERAgA4AlAgAyAPQQcgARECADgCFCADIA5BByABEQIAOAJMIAMgD0EGIAERAgA4AhggAyAOQQYgARECADgCSCADIA9BBSABEQIAOAIcIAMgDkEFIAERAgA4AkQgAyAPQQQgARECADgCICADIA5BBCABEQIAOAJAIAMgD0EDIAERAgA4AiQgAyAOQQMgARECADgCPCADIA9BAiABEQIAOAIoIAMgDkECIAERAgA4AjggAyAPQQEgARECADgCLCADIA5BASABEQIAOAI0IAogCUENdGohDCACKgIEIREgAioCDCESIAIqAgghKUEAIQIDQCMAQTBr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TgRAIAQhBQNAIAUiBkEBayEFIAEgCEGgAWogBkEDdGorAwCgIQEgBg0ACwsgDCABmiABIBAbOQMAIAgrA6ABIAGhIQFBASEFIARBAEoEQANAIAEgCEGgAWogBUEDdGorAwCgIQEgBCAFRyEGIAVBAWohBSAGDQALCyAMIAGaIAEgEBs5AwggCEGwBGokACAPQQdxIQQgDCsDACEBIChCAFMEQCAHIAGaOQMAIAcgDCsDCJo5AwhBACAEayEEDAELIAcgATkDACAHIAwrAwg5AwgLIAxBMGokAAJAAkACQAJAIARBA3EOAwABAgMLIAcrAwAgBysDCEEBEFUhAQwDCyAHKwMAIAcrAwgQciEBDAILIAcrAwAgBysDCEEBEFWaIQEMAQsgBysDACAHKwMIEHKaIQELIAdBEGokACABIAKjBUQAAAAAAADwPwuioiIBmUQAAAAAAADgQWMEQCABqgwBC0GAgICAeAs7AQAgE0EBaiITIBFHDQALIBRBAWoiFCASRw0ACwsgAA8LQcsQQaAKQekBQewJEAAACxAAIAAoAgwiAARAIAAQIQsLDgAgAEH4MDYCACAAECELDAAgAEH4MDYCACAACxcAQwAAgD8gASABbLIgAJRDAACAP5KVCxQAQwAAgD8gAbIgAJRDAACAP5KVC4IMAwt8A34FfyMAQRBrIhIkAAJAAkBBACABa7ciBL0iDkI0iKciEUH/D3EiE0G+CGsiFEH/fksgALsiA70iDUI0iKciAUH/D2tBgnBPcQ0AIA5CAYYiD0IBfUL/////////b1oEQEQAAAAAAADwPyECIA1CgICAgICAgPg/UQ0CIA9QDQIgD0KBgICAgICAcFQgDUIBhiINQoCAgICAgIBwWHFFBEAgAyAEoCECDAMLIA1CgICAgICAgPD/AFENAkQAAAAAAAAAACAEIASiIA1C/////////+//AFYgDkIAWXMbIQIMAgsgDUIBhkIBfUL/////////b1oEQCADIAOiIQIgDUIAUwRAIAKaIAIgDhBzQQFGGyECCyAOQgBZDQIgEkQAAAAAAADwPyACozkDCCASKwMIIQIMAgsgDUIAUwRAIA4QcyIQRQRAIAMgA6EiAiACoyECDAMLIBBBAUZBEnQhECANQv///////////wCDIQ0gAUH/D3EhAQsgFEH/fk0EQEQAAAAAAADwPyECIA1CgICAgICAgPg/UQ0CIBNBvQdNBEAgBCAEmiANQoCAgICAgID4P1YbRAAAAAAAAPA/oCECDAMLIBFBgBBJIA1CgYCAgICAgPg/VEcEQCMAQRBrIgFEAAAAAAAAAHA5AwggASsDCEQAAAAAAAAAcKIhAgwDCyMAQRBrIgFEAAAAAAAAABA5AwggASsDCEQAAAAAAAAAEKIhAgwCCyABDQAgA0QAAAAAAAAwQ6K9Qv///////////wCDQoCAgICAgICgA30hDQsCQCAOQoCAgECDvyIIIA0gDUKAgICA0Kql8z99Ig1CgICAgICAgHiDfSIOQoCAgIAIfEKAgICAcIO/IgMgDUItiKdB/wBxQQV0IgFB0MkAaisDACIGokQAAAAAAADwv6AiAiACQZjJACsDACIFoiIHoiIJIA1CNIentyIKQYjJACsDAKIgAUHgyQBqKwMAoCILIAIgBiAOvyADoaIiDKAiAqAiA6AiBiAJIAMgBqGgIAwgByAFIAKiIgWgoiAKQZDJACsDAKIgAUHoyQBqKwMAoCACIAsgA6GgoKCgIAIgAiAFoiIDoiADIAMgAkHIyQArAwCiQcDJACsDAKCiIAJBuMkAKwMAokGwyQArAwCgoKIgAkGoyQArAwCiQaDJACsDAKCgoqAiB6AiA71CgICAQIO/IgWiIgK9Ig1CNIinQf8PcSIBQckHa0E/SQ0AIAFByAdNBEAgAkQAAAAAAADwP6AiApogAiAQGyECDAILIAFBiQhJIRFBACEBIBENACANQgBTBEAjAEEQayIBRAAAAAAAAACQRAAAAAAAAAAQIBAbOQMIIAErAwhEAAAAAAAAABCiIQIMAgsjAEEQayIBRAAAAAAAAADwRAAAAAAAAABwIBAbOQMIIAErAwhEAAAAAAAAAHCiIQIMAQsgBCAIoSAFoiAHIAYgA6GgIAMgBaGgIASioCACQZg4KwMAokGgOCsDACIEoCIDIAShIgRBsDgrAwCiIARBqDgrAwCiIAKgoKAiAiACoiIEIASiIAJB0DgrAwCiQcg4KwMAoKIgBCACQcA4KwMAokG4OCsDAKCiIAO9Ig6nQQR0QfAPcSIRQYg5aisDACACoKCgIQIgEUGQOWopAwAgDiAQrXxCLYZ8IQ0gAUUEQCMAQRBrIgEkAAJ8IA5CgICAgAiDUARAIA1CgICAgICAgIg/fb8iBCACoiAEoEQAAAAAAAAAf6IMAQsgDUKAgICAgICA8D98Ig2/IgQgAqIiBiAEoCICmUQAAAAAAADwP2MEfCABQoCAgICAgIAINwMIIAEgASsDCEQAAAAAAAAQAKI5AwggDUKAgICAgICAgIB/g78gAkQAAAAAAADwv0QAAAAAAADwPyACRAAAAAAAAAAAYxsiA6AiBSAGIAQgAqGgIAIgAyAFoaCgoCADoSICIAJEAAAAAAAAAABhGwUgAgtEAAAAAAAAEACiCyECIAFBEGokAAwBCyANvyIEIAKiIASgIQILIBJBEGokACACtgs3AQF/AkBBsIgBKAIAIgBFDQAgACAAKAIEIgFBAWs2AgQgAQ0AIAAgACgCACgCCBEAACAAECMLCwcAIAARDAALDwBBiIgBQYyIASgCABBBCwkAIABBADYCBAsLACAAIAE2AgRBAQsHACAAKAIECxAAIAAoAgQQViAAKAIIEFYLIgEBfyAAKAIEIAEQVwR/IAAoAgggACgCBCgCHBBXBUEACws6AQF/IAAoAgghASAAQQA2AgggAQRAIAEQLhAhCyAAKAIEIQEgAEEANgIEIAEEQCABEC4QIQsgABAhC/UCAQJ/IAAEQCAAKAIEIgEEQCABEEgQIQsgACgCCCIBBEAgARAhCwJAIAAoAvQCIgFFDQAgASABKAIEIgJBAWs2AgQgAg0AIAEgASgCACgCCBEAACABECMLAkAgACgC7AIiAUUNACABIAEoAgQiAkEBazYCBCACDQAgASABKAIAKAIIEQAAIAEQIwsCQCAAKALQASIBRQ0AIAEgASgCBCICQQFrNgIEIAINACABIAEoAgAoAggRAAAgARAjCwJAIAAoAsgBIgFFDQAgASABKAIEIgJBAWs2AgQgAg0AIAEgASgCACgCCBEAACABECMLAkAgACgCLCIBRQ0AIAEgASgCBCICQQFrNgIEIAINACABIAEoAgAoAggRAAAgARAjCwJAIAAoAiQiAUUNACABIAEoAgQiAkEBazYCBCACDQAgASABKAIAKAIIEQAAIAEQIwsgACgCDCEBIABBADYCDCABBEAgASABKAIAKAIIEQAACyAAECELCzgBAX8gACgCCCEBIABBADYCCCABBEAgARAuECELIAAoAgQhASAAQQA2AgQgAQRAIAEQLhAhCyAACwoAIAAo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9ShcKEBE9ihcj8L19D9E8WjjiLX49D5BkB9BIRBlIgJCiq6PhdfHwoLAADcDmMEIIAJCmrPmzJmzpo7AADcDkMEIIAJCnYKK7erg88A/NwOIwQggAkKAgICAgICAkcAANwOAwQggAkGoIzYCACACQaDBCGpBCxA3IQAgAkEAOgC4wTAgAiACKwNAIAIrAyhEAAAAAAAA4D+iRI3ttaD3xrA+oiACKwMIo6I5A2AgAiACKwMoIgo5A7DBMCACLQC4wTAEQCACIApEWfuGtW9Yyz+iOQOwwTAgAiACKwNgRFn7hrVvWMs/ojkDYAsgAEEAEDYgAUEIEDciAEEAEDYDQCACIANBA3RqQcDBMGogACADQQAQMkTKMsSxLm7LP6JEzMzMzMxMFECgOQMAIANBAWoiA0GAAkcNAAsgABAzIAFBkAQQICIANgKAASABIABBkARqIgM2AogBIABBkB9BkAQQKBogASADNgKEASACKwMgIQogAisDMCELIAEgAisDODkDGCABIAs5AxAgASAKOQMIIAFCADcDACABQSBqIAFBgAFqECkhAyABKAKAASIABEAgASAANgKEASAAECELIAIgARBkIAMoAgAiAARAIAEgADYCJCAAECELIAFBkAQQICIANgKAASABIABBkARqIgM2AogBIABBkB9BkAQQKBogASADNgKEASACKwMgIQogAisDMCELIAEgAisDODkDGCABIAs5AxAgASAKOQMIIAFCADcDACABQSBqIAFBgAFqECkhBiABKAKAASIABEAgASAANgKEASAAECELIAJB+IAIaiEHRAAAAAAAAPA/IAIrA1CjIQtBACEAAkACQANAIAEgASsDEDkDACAEQRB0QQEgBBsiBQRAIAS3RFVVVVVVVfU/oiEMRAAAAAAAAPA/IARBASAEG7ejIQ0gAisDMCEKQQAhAwNAIAEgDCALIAO3oiANoiAKoBAnIQogAiACKAL4wAhBAWpB/wdxIgg2AvjACAJ/IAIrA1AgCiACKwMwIgqhoiAHIAhBA3RqKwMAoCIOmUQAAAAAAADgQWMEQCAOqgwBC0GAgICAeAsiCEGAgARPDQMgAigCaCAAQQF0aiAIOwEAIABBAWohACADQQFqIgMgBUcNAAsLIARBAWoiBEEIRw0ACyAGKAIAIgAEQCABIAA2AiQgABAhCyABQZAEECAiADYCgAEgASAAQZAEaiIENgKIASAAQZAfQZAEECgaIAEgBDYChAEgAisDICEKIAIrAzAhCyABIAIrAzg5AxggASALOQMQIAEgCjkDCCABQgA3AwAgAUEgaiABQYABahApIQYgASgCgAEiAARAIAEgADYChAEgABAhC0QAAAAAAADwPyACKwNQoyELIAIrAzAhCkEAIQBBACEEA0AgASABKwMQOQMAIAS3RAAAAAAAAChAoyEMQQAhAwNAIAEgDCADtyALoiAKoBAnIQogAiACKAL4wAhBAWpB/wdxIgU2AvjACAJ/IAIrA1AgCiACKwMwIgqhoiAHIAVBA3RqKwMAoCINmUQAAAAAAADgQWMEQCANqgwBC0GAgICAeAsiBUGAgARPDQIgAigCcCAAQQF0aiAFOwEAIABBAWohACADQQFqIgNBgIAERw0ACyAEQQFqIgRBEEcNAAsgBigCACIABEAgASAANgIkIAAQISACKwMwIQoLIAFBkAQQICIANgIAIAEgAEGQBGoiBDYCCCAAQZAfQZAEECgaIAEgBDYCBCACKwMgIQsgASACKwM4OQOYASABIAo5A5ABIAEgCzkDiAEgAUIANwOAASABQaABaiABECkhBiABKAIAIgAEQCABIAA2AgQgABAhCyABQgA3A3ggAUKAgICAgICA4D83A3AgAUKAgICAgICA6D83A2ggAUKAgICAgICA7D83A2AgAUKAgICAgICA8D83A1ggAUKAgICAgICA8j83A1AgAUKAgICAgICA9D83A0ggAUKAgICAgICA9j83A0AgAUKAgICAgICA+D83AzggAUKAgICAgICA+T83AzAgAUKAgICAgICA+j83AyggAUKAgICAgICA+z83AyAgAUKAgICAgICA/D83AxggAUKAgICAgICA/T83AxAgAUKAgICAgICA/j83AwggAUKAgICAgICA/z83AwBEAAAAAAAA8D8gAisDUKMhDCACKwMwIQpBACEAQQAhBANAIAEgASsDkAE5A4ABIAEgBEEDdGorAwAhDUEAIQMDQCABQYABaiANIAO3IAyiIAqgECchCiACIAIoAvjACEEBakH/B3EiBTYC+MAIAn8gAisDUCILIAogAisDMCIKoaIgByAFQQN0aisDAKAiDplEAAAAAAAA4EFjBEAgDqoMAQtBgICAgHgLIgVBgIAETw0C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dGVycwBlbmFibGVPbGQ2NTgxY2FwcwBzZXRDb21iaW5lZFdhdmVmb3JtcwB2ZWN0b3IAZW5hYmxlRmlsdGVyAFNpbmNSZXNhbXBsZXIAdG9fdWludDE2X2RpdGhlcgBudW1iZXIAdW5zaWduZWQgY2hhcgAvaG9tZS9wZXJyeS9zaWRpL2xpYnJlc2lkZnAtbWFpbi9zcmMvcmVzYW1wbGUvU2luY1Jlc2FtcGxlci5jcHAAL2hvbWUvcGVycnkvc2lkaS9saWJyZXNpZGZwLW1haW4vc3JjL1NwbGluZS5jcHAAL2hvbWUvcGVycnkvc2lkaS9saWJyZXNpZGZwLW1haW4vc3JjL0ludGVncmF0b3I2NTgxLmNwcAAvaG9tZS9wZXJyeS9zaWRpL2xpYnJlc2lkZnAtbWFpbi9zcmMvRmlsdGVyNjU4MS5jcHAAL2hvbWUvcGVycnkvc2lkaS9saWJyZXNpZGZwLW1haW4vc3JjL0ludGVncmF0b3I4NTgwLmNwcABib29sAHNldENoaXBNb2RlbABnZXRDaGlwTW9kZWwAZW1zY3JpcHRlbjo6dmFsAGNsb2NrAGxlbmd0aAAvaG9tZS9wZXJyeS9zaWRpL2xpYnJlc2lkZnAtbWFpbi9zcmMvRmlsdGVyTW9kZWxDb25maWcuaAAvaG9tZS9wZXJyeS9zaWRpL2xpYnJlc2lkZnAtbWFpbi9zcmMvU0lELmgAL2hvbWUvcGVycnkvc2lkaS9saWJyZXNpZGZwLW1haW4vc3JjL0ludGVncmF0b3I4NTgwLmgAdW5zaWduZWQgbG9uZwBzdGQ6OndzdHJpbmcAYmFzaWNfc3RyaW5nAHN0ZDo6c3RyaW5nAHN0ZDo6dTE2c3RyaW5nAHN0ZDo6dTMyc3RyaW5nAGJ1ZgBzZXRGaWx0ZXI2NTgxQ3VydmUAc2V0RmlsdGVyODU4MEN1cnZlAHNvbHZlAHdyaXRlAFVua25vd24gY29tYmluZWQgd2F2ZWZvcm1zIHR5cGUAVW5rbm93biBjaGlwIHR5cGUAU3BsaW5lAGRvdWJsZQBzZXRGaWx0ZXI2NTgxUmFuZ2UAVW5rbm93biBzYW1wbGluZyBtZXRob2QAU2FtcGxpbmdNZXRob2QAdm9pZABtdXRleCBsb2NrIGZhaWxlZAByZWFkAHRtcCA8PSBVSU5UMTZfTUFYAHNldFYAV0VBSwBTVFJPTkcAZmlyTiA8IFJJTkdTSVpFAERFQ0lNQVRFAE5PTkUAUkVTQU1QTEUAQVZFUkFHRQBTSUQAZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZmxvYXQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDhfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBjaGFyPgBzdGQ6OmJhc2ljX3N0cmluZzx1bnNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8bG9uZz4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgbG9uZz4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZG91YmxlPgBpbnB1dC5zaXplKCkgPiAyAE1PUzY1ODEAQ1NHODU4MAB2ID4gMS4wICYmIHYgPCAyLjAAYnVmU2l6ZSA+IDAAVmZpbHQgPj0gMAAodG1wID49IDApICYmICh0bXAgPD0gVVNIUlRfTUFYKQAoa1ZndF9WcyA+PSAwKSAmJiAoa1ZndF9WcyA8PSBVSU5UMTZfTUFYKQAoa1ZndF9WZCA+PSAwKSAmJiAoa1ZndF9WZCA8PSBVSU5UMTZfTUFYKQBQdXJlIHZpcnR1YWwgZnVuY3Rpb24g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";
			if (!isDataURI(wasmBinaryFile)) wasmBinaryFile = locateFile(wasmBinaryFile);
			function getBinary(file) {
				try {
					if (file == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
					var binary = tryParseAsDataURI(file);
					if (binary) return binary;
					if (readBinary) return readBinary(file);
					else throw "both async and sync fetching of the wasm failed";
				} catch (err) {
					abort(err);
				}
			}
			function getBinaryPromise() {
				if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
					if (typeof fetch == "function" && !isFileURI(wasmBinaryFile)) return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
						if (!response["ok"]) throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
						return response["arrayBuffer"]();
					}).catch(function() {
						return getBinary(wasmBinaryFile);
					});
					else if (readAsync) return new Promise(function(resolve, reject) {
						readAsync(wasmBinaryFile, function(response) {
							resolve(new Uint8Array(response));
						}, reject);
					});
				}
				return Promise.resolve().then(function() {
					return getBinary(wasmBinaryFile);
				});
			}
			function createWasm() {
				var info = { "a": asmLibraryArg };
				function receiveInstance(instance, module$1) {
					var exports$1 = instance.exports;
					Module["asm"] = exports$1;
					wasmMemory = Module["asm"]["G"];
					updateGlobalBufferAndViews(wasmMemory.buffer);
					wasmTable = Module["asm"]["I"];
					addOnInit(Module["asm"]["H"]);
					removeRunDependency("wasm-instantiate");
				}
				addRunDependency("wasm-instantiate");
				function receiveInstantiationResult(result) {
					receiveInstance(result["instance"]);
				}
				function instantiateArrayBuffer(receiver) {
					return getBinaryPromise().then(function(binary) {
						return WebAssembly.instantiate(binary, info);
					}).then(function(instance) {
						return instance;
					}).then(receiver, function(reason) {
						err("failed to asynchronously prepare wasm: " + reason);
						abort(reason);
					});
				}
				function instantiateAsync() {
					if (!wasmBinary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch == "function") return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
						return WebAssembly.instantiateStreaming(response, info).then(receiveInstantiationResult, function(reason) {
							err("wasm streaming compile failed: " + reason);
							err("falling back to ArrayBuffer instantiation");
							return instantiateArrayBuffer(receiveInstantiationResult);
						});
					});
					else return instantiateArrayBuffer(receiveInstantiationResult);
				}
				if (Module["instantiateWasm"]) try {
					return Module["instantiateWasm"](info, receiveInstance);
				} catch (e) {
					err("Module.instantiateWasm callback failed with error: " + e);
					return false;
				}
				instantiateAsync().catch(readyPromiseReject);
				return {};
			}
			function callRuntimeCallbacks(callbacks) {
				while (callbacks.length > 0) {
					var callback = callbacks.shift();
					if (typeof callback == "function") {
						callback(Module);
						continue;
					}
					var func = callback.func;
					if (typeof func == "number") if (callback.arg === void 0) getWasmTableEntry(func)();
					else getWasmTableEntry(func)(callback.arg);
					else func(callback.arg === void 0 ? null : callback.arg);
				}
			}
			var wasmTableMirror = [];
			function getWasmTableEntry(funcPtr) {
				var func = wasmTableMirror[funcPtr];
				if (!func) {
					if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
					wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
				}
				return func;
			}
			function ___assert_fail(condition, filename, line, func) {
				abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [
					filename ? UTF8ToString(filename) : "unknown filename",
					line,
					func ? UTF8ToString(func) : "unknown function"
				]);
			}
			function ___cxa_allocate_exception(size) {
				return _malloc(size + 16) + 16;
			}
			function ExceptionInfo(excPtr) {
				this.excPtr = excPtr;
				this.ptr = excPtr - 16;
				this.set_type = function(type) {
					HEAP32[this.ptr + 4 >> 2] = type;
				};
				this.get_type = function() {
					return HEAP32[this.ptr + 4 >> 2];
				};
				this.set_destructor = function(destructor) {
					HEAP32[this.ptr + 8 >> 2] = destructor;
				};
				this.get_destructor = function() {
					return HEAP32[this.ptr + 8 >> 2];
				};
				this.set_refcount = function(refcount) {
					HEAP32[this.ptr >> 2] = refcount;
				};
				this.set_caught = function(caught) {
					caught = caught ? 1 : 0;
					HEAP8[this.ptr + 12 >> 0] = caught;
				};
				this.get_caught = function() {
					return HEAP8[this.ptr + 12 >> 0] != 0;
				};
				this.set_rethrown = function(rethrown) {
					rethrown = rethrown ? 1 : 0;
					HEAP8[this.ptr + 13 >> 0] = rethrown;
				};
				this.get_rethrown = function() {
					return HEAP8[this.ptr + 13 >> 0] != 0;
				};
				this.init = function(type, destructor) {
					this.set_type(type);
					this.set_destructor(destructor);
					this.set_refcount(0);
					this.set_caught(false);
					this.set_rethrown(false);
				};
				this.add_ref = function() {
					var value = HEAP32[this.ptr >> 2];
					HEAP32[this.ptr >> 2] = value + 1;
				};
				this.release_ref = function() {
					var prev = HEAP32[this.ptr >> 2];
					HEAP32[this.ptr >> 2] = prev - 1;
					return prev === 1;
				};
			}
			var uncaughtExceptionCount = 0;
			function ___cxa_throw(ptr, type, destructor) {
				new ExceptionInfo(ptr).init(type, destructor);
				uncaughtExceptionCount++;
				throw ptr;
			}
			function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {}
			function getShiftFromSize(size) {
				switch (size) {
					case 1: return 0;
					case 2: return 1;
					case 4: return 2;
					case 8: return 3;
					default: throw new TypeError("Unknown type size: " + size);
				}
			}
			function embind_init_charCodes() {
				var codes = new Array(256);
				for (var i = 0; i < 256; ++i) codes[i] = String.fromCharCode(i);
				embind_charCodes = codes;
			}
			var embind_charCodes = void 0;
			function readLatin1String(ptr) {
				var ret = "";
				var c = ptr;
				while (HEAPU8[c]) ret += embind_charCodes[HEAPU8[c++]];
				return ret;
			}
			var awaitingDependencies = {};
			var registeredTypes = {};
			var typeDependencies = {};
			var char_0 = 48;
			var char_9 = 57;
			function makeLegalFunctionName(name) {
				if (void 0 === name) return "_unknown";
				name = name.replace(/[^a-zA-Z0-9_]/g, "$");
				var f = name.charCodeAt(0);
				if (f >= char_0 && f <= char_9) return "_" + name;
				else return name;
			}
			function createNamedFunction(name, body) {
				name = makeLegalFunctionName(name);
				return new Function("body", "return function " + name + "() {\n    \"use strict\";    return body.apply(this, arguments);\n};\n")(body);
			}
			function extendError(baseErrorType, errorName) {
				var errorClass = createNamedFunction(errorName, function(message) {
					this.name = errorName;
					this.message = message;
					var stack = new Error(message).stack;
					if (stack !== void 0) this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
				});
				errorClass.prototype = Object.create(baseErrorType.prototype);
				errorClass.prototype.constructor = errorClass;
				errorClass.prototype.toString = function() {
					if (this.message === void 0) return this.name;
					else return this.name + ": " + this.message;
				};
				return errorClass;
			}
			var BindingError = void 0;
			function throwBindingError(message) {
				throw new BindingError(message);
			}
			var InternalError = void 0;
			function throwInternalError(message) {
				throw new InternalError(message);
			}
			function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
				myTypes.forEach(function(type) {
					typeDependencies[type] = dependentTypes;
				});
				function onComplete(typeConverters) {
					var myTypeConverters = getTypeConverters(typeConverters);
					if (myTypeConverters.length !== myTypes.length) throwInternalError("Mismatched type converter count");
					for (var i = 0; i < myTypes.length; ++i) registerType(myTypes[i], myTypeConverters[i]);
				}
				var typeConverters = new Array(dependentTypes.length);
				var unregisteredTypes = [];
				var registered = 0;
				dependentTypes.forEach(function(dt, i) {
					if (registeredTypes.hasOwnProperty(dt)) typeConverters[i] = registeredTypes[dt];
					else {
						unregisteredTypes.push(dt);
						if (!awaitingDependencies.hasOwnProperty(dt)) awaitingDependencies[dt] = [];
						awaitingDependencies[dt].push(function() {
							typeConverters[i] = registeredTypes[dt];
							++registered;
							if (registered === unregisteredTypes.length) onComplete(typeConverters);
						});
					}
				});
				if (0 === unregisteredTypes.length) onComplete(typeConverters);
			}
			function registerType(rawType, registeredInstance, options = {}) {
				if (!("argPackAdvance" in registeredInstance)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
				var name = registeredInstance.name;
				if (!rawType) throwBindingError("type \"" + name + "\" must have a positive integer typeid pointer");
				if (registeredTypes.hasOwnProperty(rawType)) if (options.ignoreDuplicateRegistrations) return;
				else throwBindingError("Cannot register type '" + name + "' twice");
				registeredTypes[rawType] = registeredInstance;
				delete typeDependencies[rawType];
				if (awaitingDependencies.hasOwnProperty(rawType)) {
					var callbacks = awaitingDependencies[rawType];
					delete awaitingDependencies[rawType];
					callbacks.forEach(function(cb) {
						cb();
					});
				}
			}
			function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
				var shift = getShiftFromSize(size);
				name = readLatin1String(name);
				registerType(rawType, {
					name,
					"fromWireType": function(wt) {
						return !!wt;
					},
					"toWireType": function(destructors, o) {
						return o ? trueValue : falseValue;
					},
					"argPackAdvance": 8,
					"readValueFromPointer": function(pointer) {
						var heap;
						if (size === 1) heap = HEAP8;
						else if (size === 2) heap = HEAP16;
						else if (size === 4) heap = HEAP32;
						else throw new TypeError("Unknown boolean type size: " + name);
						return this["fromWireType"](heap[pointer >> shift]);
					},
					destructorFunction: null
				});
			}
			function ClassHandle_isAliasOf(other) {
				if (!(this instanceof ClassHandle)) return false;
				if (!(other instanceof ClassHandle)) return false;
				var leftClass = this.$$.ptrType.registeredClass;
				var left = this.$$.ptr;
				var rightClass = other.$$.ptrType.registeredClass;
				var right = other.$$.ptr;
				while (leftClass.baseClass) {
					left = leftClass.upcast(left);
					leftClass = leftClass.baseClass;
				}
				while (rightClass.baseClass) {
					right = rightClass.upcast(right);
					rightClass = rightClass.baseClass;
				}
				return leftClass === rightClass && left === right;
			}
			function shallowCopyInternalPointer(o) {
				return {
					count: o.count,
					deleteScheduled: o.deleteScheduled,
					preservePointerOnDelete: o.preservePointerOnDelete,
					ptr: o.ptr,
					ptrType: o.ptrType,
					smartPtr: o.smartPtr,
					smartPtrType: o.smartPtrType
				};
			}
			function throwInstanceAlreadyDeleted(obj) {
				function getInstanceTypeName(handle) {
					return handle.$$.ptrType.registeredClass.name;
				}
				throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
			}
			var finalizationRegistry = false;
			function detachFinalizer(handle) {}
			function runDestructor($$) {
				if ($$.smartPtr) $$.smartPtrType.rawDestructor($$.smartPtr);
				else $$.ptrType.registeredClass.rawDestructor($$.ptr);
			}
			function releaseClassHandle($$) {
				$$.count.value -= 1;
				if (0 === $$.count.value) runDestructor($$);
			}
			function downcastPointer(ptr, ptrClass, desiredClass) {
				if (ptrClass === desiredClass) return ptr;
				if (void 0 === desiredClass.baseClass) return null;
				var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
				if (rv === null) return null;
				return desiredClass.downcast(rv);
			}
			var registeredPointers = {};
			function getInheritedInstanceCount() {
				return Object.keys(registeredInstances).length;
			}
			function getLiveInheritedInstances() {
				var rv = [];
				for (var k in registeredInstances) if (registeredInstances.hasOwnProperty(k)) rv.push(registeredInstances[k]);
				return rv;
			}
			var deletionQueue = [];
			function flushPendingDeletes() {
				while (deletionQueue.length) {
					var obj = deletionQueue.pop();
					obj.$$.deleteScheduled = false;
					obj["delete"]();
				}
			}
			var delayFunction = void 0;
			function setDelayFunction(fn) {
				delayFunction = fn;
				if (deletionQueue.length && delayFunction) delayFunction(flushPendingDeletes);
			}
			function init_embind() {
				Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
				Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
				Module["flushPendingDeletes"] = flushPendingDeletes;
				Module["setDelayFunction"] = setDelayFunction;
			}
			var registeredInstances = {};
			function getBasestPointer(class_, ptr) {
				if (ptr === void 0) throwBindingError("ptr should not be undefined");
				while (class_.baseClass) {
					ptr = class_.upcast(ptr);
					class_ = class_.baseClass;
				}
				return ptr;
			}
			function getInheritedInstance(class_, ptr) {
				ptr = getBasestPointer(class_, ptr);
				return registeredInstances[ptr];
			}
			function makeClassHandle(prototype, record) {
				if (!record.ptrType || !record.ptr) throwInternalError("makeClassHandle requires ptr and ptrType");
				if (!!record.smartPtrType !== !!record.smartPtr) throwInternalError("Both smartPtrType and smartPtr must be specified");
				record.count = { value: 1 };
				return attachFinalizer(Object.create(prototype, { $$: { value: record } }));
			}
			function RegisteredPointer_fromWireType(ptr) {
				var rawPointer = this.getPointee(ptr);
				if (!rawPointer) {
					this.destructor(ptr);
					return null;
				}
				var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
				if (void 0 !== registeredInstance) if (0 === registeredInstance.$$.count.value) {
					registeredInstance.$$.ptr = rawPointer;
					registeredInstance.$$.smartPtr = ptr;
					return registeredInstance["clone"]();
				} else {
					var rv = registeredInstance["clone"]();
					this.destructor(ptr);
					return rv;
				}
				function makeDefaultHandle() {
					if (this.isSmartPointer) return makeClassHandle(this.registeredClass.instancePrototype, {
						ptrType: this.pointeeType,
						ptr: rawPointer,
						smartPtrType: this,
						smartPtr: ptr
					});
					else return makeClassHandle(this.registeredClass.instancePrototype, {
						ptrType: this,
						ptr
					});
				}
				var registeredPointerRecord = registeredPointers[this.registeredClass.getActualType(rawPointer)];
				if (!registeredPointerRecord) return makeDefaultHandle.call(this);
				var toType;
				if (this.isConst) toType = registeredPointerRecord.constPointerType;
				else toType = registeredPointerRecord.pointerType;
				var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
				if (dp === null) return makeDefaultHandle.call(this);
				if (this.isSmartPointer) return makeClassHandle(toType.registeredClass.instancePrototype, {
					ptrType: toType,
					ptr: dp,
					smartPtrType: this,
					smartPtr: ptr
				});
				else return makeClassHandle(toType.registeredClass.instancePrototype, {
					ptrType: toType,
					ptr: dp
				});
			}
			function attachFinalizer(handle) {
				if ("undefined" === typeof FinalizationRegistry) {
					attachFinalizer = ((handle) => handle);
					return handle;
				}
				finalizationRegistry = new FinalizationRegistry((info) => {
					releaseClassHandle(info.$$);
				});
				attachFinalizer = ((handle) => {
					var $$ = handle.$$;
					if (!!$$.smartPtr) {
						var info = { $$ };
						finalizationRegistry.register(handle, info, handle);
					}
					return handle;
				});
				detachFinalizer = ((handle) => finalizationRegistry.unregister(handle));
				return attachFinalizer(handle);
			}
			function ClassHandle_clone() {
				if (!this.$$.ptr) throwInstanceAlreadyDeleted(this);
				if (this.$$.preservePointerOnDelete) {
					this.$$.count.value += 1;
					return this;
				} else {
					var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
					clone.$$.count.value += 1;
					clone.$$.deleteScheduled = false;
					return clone;
				}
			}
			function ClassHandle_delete() {
				if (!this.$$.ptr) throwInstanceAlreadyDeleted(this);
				if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) throwBindingError("Object already scheduled for deletion");
				detachFinalizer(this);
				releaseClassHandle(this.$$);
				if (!this.$$.preservePointerOnDelete) {
					this.$$.smartPtr = void 0;
					this.$$.ptr = void 0;
				}
			}
			function ClassHandle_isDeleted() {
				return !this.$$.ptr;
			}
			function ClassHandle_deleteLater() {
				if (!this.$$.ptr) throwInstanceAlreadyDeleted(this);
				if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) throwBindingError("Object already scheduled for deletion");
				deletionQueue.push(this);
				if (deletionQueue.length === 1 && delayFunction) delayFunction(flushPendingDeletes);
				this.$$.deleteScheduled = true;
				return this;
			}
			function init_ClassHandle() {
				ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
				ClassHandle.prototype["clone"] = ClassHandle_clone;
				ClassHandle.prototype["delete"] = ClassHandle_delete;
				ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
				ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
			}
			function ClassHandle() {}
			function ensureOverloadTable(proto, methodName, humanName) {
				if (void 0 === proto[methodName].overloadTable) {
					var prevFunc = proto[methodName];
					proto[methodName] = function() {
						if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
						return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
					};
					proto[methodName].overloadTable = [];
					proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
				}
			}
			function exposePublicSymbol(name, value, numArguments) {
				if (Module.hasOwnProperty(name)) {
					if (void 0 === numArguments || void 0 !== Module[name].overloadTable && void 0 !== Module[name].overloadTable[numArguments]) throwBindingError("Cannot register public name '" + name + "' twice");
					ensureOverloadTable(Module, name, name);
					if (Module.hasOwnProperty(numArguments)) throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
					Module[name].overloadTable[numArguments] = value;
				} else {
					Module[name] = value;
					if (void 0 !== numArguments) Module[name].numArguments = numArguments;
				}
			}
			function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
				this.name = name;
				this.constructor = constructor;
				this.instancePrototype = instancePrototype;
				this.rawDestructor = rawDestructor;
				this.baseClass = baseClass;
				this.getActualType = getActualType;
				this.upcast = upcast;
				this.downcast = downcast;
				this.pureVirtualFunctions = [];
			}
			function upcastPointer(ptr, ptrClass, desiredClass) {
				while (ptrClass !== desiredClass) {
					if (!ptrClass.upcast) throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
					ptr = ptrClass.upcast(ptr);
					ptrClass = ptrClass.baseClass;
				}
				return ptr;
			}
			function constNoSmartPtrRawPointerToWireType(destructors, handle) {
				if (handle === null) {
					if (this.isReference) throwBindingError("null is not a valid " + this.name);
					return 0;
				}
				if (!handle.$$) throwBindingError("Cannot pass \"" + _embind_repr(handle) + "\" as a " + this.name);
				if (!handle.$$.ptr) throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
				var handleClass = handle.$$.ptrType.registeredClass;
				return upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
			}
			function genericPointerToWireType(destructors, handle) {
				var ptr;
				if (handle === null) {
					if (this.isReference) throwBindingError("null is not a valid " + this.name);
					if (this.isSmartPointer) {
						ptr = this.rawConstructor();
						if (destructors !== null) destructors.push(this.rawDestructor, ptr);
						return ptr;
					} else return 0;
				}
				if (!handle.$$) throwBindingError("Cannot pass \"" + _embind_repr(handle) + "\" as a " + this.name);
				if (!handle.$$.ptr) throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
				if (!this.isConst && handle.$$.ptrType.isConst) throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
				var handleClass = handle.$$.ptrType.registeredClass;
				ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
				if (this.isSmartPointer) {
					if (void 0 === handle.$$.smartPtr) throwBindingError("Passing raw pointer to smart pointer is illegal");
					switch (this.sharingPolicy) {
						case 0:
							if (handle.$$.smartPtrType === this) ptr = handle.$$.smartPtr;
							else throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
							break;
						case 1:
							ptr = handle.$$.smartPtr;
							break;
						case 2:
							if (handle.$$.smartPtrType === this) ptr = handle.$$.smartPtr;
							else {
								var clonedHandle = handle["clone"]();
								ptr = this.rawShare(ptr, Emval.toHandle(function() {
									clonedHandle["delete"]();
								}));
								if (destructors !== null) destructors.push(this.rawDestructor, ptr);
							}
							break;
						default: throwBindingError("Unsupporting sharing policy");
					}
				}
				return ptr;
			}
			function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
				if (handle === null) {
					if (this.isReference) throwBindingError("null is not a valid " + this.name);
					return 0;
				}
				if (!handle.$$) throwBindingError("Cannot pass \"" + _embind_repr(handle) + "\" as a " + this.name);
				if (!handle.$$.ptr) throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
				if (handle.$$.ptrType.isConst) throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
				var handleClass = handle.$$.ptrType.registeredClass;
				return upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
			}
			function simpleReadValueFromPointer(pointer) {
				return this["fromWireType"](HEAPU32[pointer >> 2]);
			}
			function RegisteredPointer_getPointee(ptr) {
				if (this.rawGetPointee) ptr = this.rawGetPointee(ptr);
				return ptr;
			}
			function RegisteredPointer_destructor(ptr) {
				if (this.rawDestructor) this.rawDestructor(ptr);
			}
			function RegisteredPointer_deleteObject(handle) {
				if (handle !== null) handle["delete"]();
			}
			function init_RegisteredPointer() {
				RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
				RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
				RegisteredPointer.prototype["argPackAdvance"] = 8;
				RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
				RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
				RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
			}
			function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
				this.name = name;
				this.registeredClass = registeredClass;
				this.isReference = isReference;
				this.isConst = isConst;
				this.isSmartPointer = isSmartPointer;
				this.pointeeType = pointeeType;
				this.sharingPolicy = sharingPolicy;
				this.rawGetPointee = rawGetPointee;
				this.rawConstructor = rawConstructor;
				this.rawShare = rawShare;
				this.rawDestructor = rawDestructor;
				if (!isSmartPointer && registeredClass.baseClass === void 0) if (isConst) {
					this["toWireType"] = constNoSmartPtrRawPointerToWireType;
					this.destructorFunction = null;
				} else {
					this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
					this.destructorFunction = null;
				}
				else this["toWireType"] = genericPointerToWireType;
			}
			function replacePublicSymbol(name, value, numArguments) {
				if (!Module.hasOwnProperty(name)) throwInternalError("Replacing nonexistant public symbol");
				if (void 0 !== Module[name].overloadTable && void 0 !== numArguments) Module[name].overloadTable[numArguments] = value;
				else {
					Module[name] = value;
					Module[name].argCount = numArguments;
				}
			}
			function dynCallLegacy(sig, ptr, args) {
				var f = Module["dynCall_" + sig];
				return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
			}
			function dynCall(sig, ptr, args) {
				if (sig.includes("j")) return dynCallLegacy(sig, ptr, args);
				return getWasmTableEntry(ptr).apply(null, args);
			}
			function getDynCaller(sig, ptr) {
				var argCache = [];
				return function() {
					argCache.length = 0;
					Object.assign(argCache, arguments);
					return dynCall(sig, ptr, argCache);
				};
			}
			function embind__requireFunction(signature, rawFunction) {
				signature = readLatin1String(signature);
				function makeDynCaller() {
					if (signature.includes("j")) return getDynCaller(signature, rawFunction);
					return getWasmTableEntry(rawFunction);
				}
				var fp = makeDynCaller();
				if (typeof fp != "function") throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
				return fp;
			}
			var UnboundTypeError = void 0;
			function getTypeName(type) {
				var ptr = ___getTypeName(type);
				var rv = readLatin1String(ptr);
				_free(ptr);
				return rv;
			}
			function throwUnboundTypeError(message, types) {
				var unboundTypes = [];
				var seen = {};
				function visit(type) {
					if (seen[type]) return;
					if (registeredTypes[type]) return;
					if (typeDependencies[type]) {
						typeDependencies[type].forEach(visit);
						return;
					}
					unboundTypes.push(type);
					seen[type] = true;
				}
				types.forEach(visit);
				throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
			}
			function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
				name = readLatin1String(name);
				getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
				if (upcast) upcast = embind__requireFunction(upcastSignature, upcast);
				if (downcast) downcast = embind__requireFunction(downcastSignature, downcast);
				rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
				var legalFunctionName = makeLegalFunctionName(name);
				exposePublicSymbol(legalFunctionName, function() {
					throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
				});
				whenDependentTypesAreResolved([
					rawType,
					rawPointerType,
					rawConstPointerType
				], baseClassRawType ? [baseClassRawType] : [], function(base) {
					base = base[0];
					var baseClass;
					var basePrototype;
					if (baseClassRawType) {
						baseClass = base.registeredClass;
						basePrototype = baseClass.instancePrototype;
					} else basePrototype = ClassHandle.prototype;
					var constructor = createNamedFunction(legalFunctionName, function() {
						if (Object.getPrototypeOf(this) !== instancePrototype) throw new BindingError("Use 'new' to construct " + name);
						if (void 0 === registeredClass.constructor_body) throw new BindingError(name + " has no accessible constructor");
						var body = registeredClass.constructor_body[arguments.length];
						if (void 0 === body) throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
						return body.apply(this, arguments);
					});
					var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
					constructor.prototype = instancePrototype;
					var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
					var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
					var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
					var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
					registeredPointers[rawType] = {
						pointerType: pointerConverter,
						constPointerType: constPointerConverter
					};
					replacePublicSymbol(legalFunctionName, constructor);
					return [
						referenceConverter,
						pointerConverter,
						constPointerConverter
					];
				});
			}
			function heap32VectorToArray(count, firstElement) {
				var array = [];
				for (var i = 0; i < count; i++) array.push(HEAP32[(firstElement >> 2) + i]);
				return array;
			}
			function runDestructors(destructors) {
				while (destructors.length) {
					var ptr = destructors.pop();
					destructors.pop()(ptr);
				}
			}
			function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
				assert(argCount > 0);
				var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
				invoker = embind__requireFunction(invokerSignature, invoker);
				whenDependentTypesAreResolved([], [rawClassType], function(classType) {
					classType = classType[0];
					var humanName = "constructor " + classType.name;
					if (void 0 === classType.registeredClass.constructor_body) classType.registeredClass.constructor_body = [];
					if (void 0 !== classType.registeredClass.constructor_body[argCount - 1]) throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
					classType.registeredClass.constructor_body[argCount - 1] = (() => {
						throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
					});
					whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
						argTypes.splice(1, 0, null);
						classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
						return [];
					});
					return [];
				});
			}
			function new_(constructor, argumentList) {
				if (!(constructor instanceof Function)) throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function");
				var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {});
				dummy.prototype = constructor.prototype;
				var obj = new dummy();
				var r = constructor.apply(obj, argumentList);
				return r instanceof Object ? r : obj;
			}
			function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
				var argCount = argTypes.length;
				if (argCount < 2) throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
				var isClassMethodFunc = argTypes[1] !== null && classType !== null;
				var needsDestructorStack = false;
				for (var i = 1; i < argTypes.length; ++i) if (argTypes[i] !== null && argTypes[i].destructorFunction === void 0) {
					needsDestructorStack = true;
					break;
				}
				var returns = argTypes[0].name !== "void";
				var argsList = "";
				var argsListWired = "";
				for (var i = 0; i < argCount - 2; ++i) {
					argsList += (i !== 0 ? ", " : "") + "arg" + i;
					argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
				}
				var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\nif (arguments.length !== " + (argCount - 2) + ") {\nthrowBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n}\n";
				if (needsDestructorStack) invokerFnBody += "var destructors = [];\n";
				var dtorStack = needsDestructorStack ? "destructors" : "null";
				var args1 = [
					"throwBindingError",
					"invoker",
					"fn",
					"runDestructors",
					"retType",
					"classParam"
				];
				var args2 = [
					throwBindingError,
					cppInvokerFunc,
					cppTargetFunc,
					runDestructors,
					argTypes[0],
					argTypes[1]
				];
				if (isClassMethodFunc) invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
				for (var i = 0; i < argCount - 2; ++i) {
					invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
					args1.push("argType" + i);
					args2.push(argTypes[i + 2]);
				}
				if (isClassMethodFunc) argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
				invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
				if (needsDestructorStack) invokerFnBody += "runDestructors(destructors);\n";
				else for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
					var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
					if (argTypes[i].destructorFunction !== null) {
						invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
						args1.push(paramName + "_dtor");
						args2.push(argTypes[i].destructorFunction);
					}
				}
				if (returns) invokerFnBody += "var ret = retType.fromWireType(rv);\nreturn ret;\n";
				invokerFnBody += "}\n";
				args1.push(invokerFnBody);
				return new_(Function, args1).apply(null, args2);
			}
			function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
				var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
				methodName = readLatin1String(methodName);
				rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
				whenDependentTypesAreResolved([], [rawClassType], function(classType) {
					classType = classType[0];
					var humanName = classType.name + "." + methodName;
					if (methodName.startsWith("@@")) methodName = Symbol[methodName.substring(2)];
					if (isPureVirtual) classType.registeredClass.pureVirtualFunctions.push(methodName);
					function unboundTypesHandler() {
						throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
					}
					var proto = classType.registeredClass.instancePrototype;
					var method = proto[methodName];
					if (void 0 === method || void 0 === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
						unboundTypesHandler.argCount = argCount - 2;
						unboundTypesHandler.className = classType.name;
						proto[methodName] = unboundTypesHandler;
					} else {
						ensureOverloadTable(proto, methodName, humanName);
						proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
					}
					whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
						var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);
						if (void 0 === proto[methodName].overloadTable) {
							memberFunction.argCount = argCount - 2;
							proto[methodName] = memberFunction;
						} else proto[methodName].overloadTable[argCount - 2] = memberFunction;
						return [];
					});
					return [];
				});
			}
			var emval_free_list = [];
			var emval_handle_array = [
				{},
				{ value: void 0 },
				{ value: null },
				{ value: true },
				{ value: false }
			];
			function __emval_decref(handle) {
				if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
					emval_handle_array[handle] = void 0;
					emval_free_list.push(handle);
				}
			}
			function count_emval_handles() {
				var count = 0;
				for (var i = 5; i < emval_handle_array.length; ++i) if (emval_handle_array[i] !== void 0) ++count;
				return count;
			}
			function get_first_emval() {
				for (var i = 5; i < emval_handle_array.length; ++i) if (emval_handle_array[i] !== void 0) return emval_handle_array[i];
				return null;
			}
			function init_emval() {
				Module["count_emval_handles"] = count_emval_handles;
				Module["get_first_emval"] = get_first_emval;
			}
			var Emval = {
				toValue: function(handle) {
					if (!handle) throwBindingError("Cannot use deleted val. handle = " + handle);
					return emval_handle_array[handle].value;
				},
				toHandle: function(value) {
					switch (value) {
						case void 0: return 1;
						case null: return 2;
						case true: return 3;
						case false: return 4;
						default:
							var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
							emval_handle_array[handle] = {
								refcount: 1,
								value
							};
							return handle;
					}
				}
			};
			function __embind_register_emval(rawType, name) {
				name = readLatin1String(name);
				registerType(rawType, {
					name,
					"fromWireType": function(handle) {
						var rv = Emval.toValue(handle);
						__emval_decref(handle);
						return rv;
					},
					"toWireType": function(destructors, value) {
						return Emval.toHandle(value);
					},
					"argPackAdvance": 8,
					"readValueFromPointer": simpleReadValueFromPointer,
					destructorFunction: null
				});
			}
			function enumReadValueFromPointer(name, shift, signed) {
				switch (shift) {
					case 0: return function(pointer) {
						var heap = signed ? HEAP8 : HEAPU8;
						return this["fromWireType"](heap[pointer]);
					};
					case 1: return function(pointer) {
						var heap = signed ? HEAP16 : HEAPU16;
						return this["fromWireType"](heap[pointer >> 1]);
					};
					case 2: return function(pointer) {
						var heap = signed ? HEAP32 : HEAPU32;
						return this["fromWireType"](heap[pointer >> 2]);
					};
					default: throw new TypeError("Unknown integer type: " + name);
				}
			}
			function __embind_register_enum(rawType, name, size, isSigned) {
				var shift = getShiftFromSize(size);
				name = readLatin1String(name);
				function ctor() {}
				ctor.values = {};
				registerType(rawType, {
					name,
					constructor: ctor,
					"fromWireType": function(c) {
						return this.constructor.values[c];
					},
					"toWireType": function(destructors, c) {
						return c.value;
					},
					"argPackAdvance": 8,
					"readValueFromPointer": enumReadValueFromPointer(name, shift, isSigned),
					destructorFunction: null
				});
				exposePublicSymbol(name, ctor);
			}
			function requireRegisteredType(rawType, humanName) {
				var impl = registeredTypes[rawType];
				if (void 0 === impl) throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
				return impl;
			}
			function __embind_register_enum_value(rawEnumType, name, enumValue) {
				var enumType = requireRegisteredType(rawEnumType, "enum");
				name = readLatin1String(name);
				var Enum = enumType.constructor;
				var Value = Object.create(enumType.constructor.prototype, {
					value: { value: enumValue },
					constructor: { value: createNamedFunction(enumType.name + "_" + name, function() {}) }
				});
				Enum.values[enumValue] = Value;
				Enum[name] = Value;
			}
			function _embind_repr(v) {
				if (v === null) return "null";
				var t = typeof v;
				if (t === "object" || t === "array" || t === "function") return v.toString();
				else return "" + v;
			}
			function floatReadValueFromPointer(name, shift) {
				switch (shift) {
					case 2: return function(pointer) {
						return this["fromWireType"](HEAPF32[pointer >> 2]);
					};
					case 3: return function(pointer) {
						return this["fromWireType"](HEAPF64[pointer >> 3]);
					};
					default: throw new TypeError("Unknown float type: " + name);
				}
			}
			function __embind_register_float(rawType, name, size) {
				var shift = getShiftFromSize(size);
				name = readLatin1String(name);
				registerType(rawType, {
					name,
					"fromWireType": function(value) {
						return value;
					},
					"toWireType": function(destructors, value) {
						return value;
					},
					"argPackAdvance": 8,
					"readValueFromPointer": floatReadValueFromPointer(name, shift),
					destructorFunction: null
				});
			}
			function integerReadValueFromPointer(name, shift, signed) {
				switch (shift) {
					case 0: return signed ? function readS8FromPointer(pointer) {
						return HEAP8[pointer];
					} : function readU8FromPointer(pointer) {
						return HEAPU8[pointer];
					};
					case 1: return signed ? function readS16FromPointer(pointer) {
						return HEAP16[pointer >> 1];
					} : function readU16FromPointer(pointer) {
						return HEAPU16[pointer >> 1];
					};
					case 2: return signed ? function readS32FromPointer(pointer) {
						return HEAP32[pointer >> 2];
					} : function readU32FromPointer(pointer) {
						return HEAPU32[pointer >> 2];
					};
					default: throw new TypeError("Unknown integer type: " + name);
				}
			}
			function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
				name = readLatin1String(name);
				if (maxRange === -1) maxRange = 4294967295;
				var shift = getShiftFromSize(size);
				var fromWireType = (value) => value;
				if (minRange === 0) {
					var bitshift = 32 - 8 * size;
					fromWireType = ((value) => value << bitshift >>> bitshift);
				}
				var isUnsignedType = name.includes("unsigned");
				var toWireType;
				if (isUnsignedType) toWireType = function(destructors, value) {
					this.name;
					return value >>> 0;
				};
				else toWireType = function(destructors, value) {
					this.name;
					return value;
				};
				registerType(primitiveType, {
					name,
					"fromWireType": fromWireType,
					"toWireType": toWireType,
					"argPackAdvance": 8,
					"readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
					destructorFunction: null
				});
			}
			function __embind_register_memory_view(rawType, dataTypeIndex, name) {
				var TA = [
					Int8Array,
					Uint8Array,
					Int16Array,
					Uint16Array,
					Int32Array,
					Uint32Array,
					Float32Array,
					Float64Array
				][dataTypeIndex];
				function decodeMemoryView(handle) {
					handle = handle >> 2;
					var heap = HEAPU32;
					var size = heap[handle];
					var data = heap[handle + 1];
					return new TA(buffer, data, size);
				}
				name = readLatin1String(name);
				registerType(rawType, {
					name,
					"fromWireType": decodeMemoryView,
					"argPackAdvance": 8,
					"readValueFromPointer": decodeMemoryView
				}, { ignoreDuplicateRegistrations: true });
			}
			function __embind_register_std_string(rawType, name) {
				name = readLatin1String(name);
				var stdStringIsUTF8 = name === "std::string";
				registerType(rawType, {
					name,
					"fromWireType": function(value) {
						var length = HEAPU32[value >> 2];
						var str;
						if (stdStringIsUTF8) {
							var decodeStartPtr = value + 4;
							for (var i = 0; i <= length; ++i) {
								var currentBytePtr = value + 4 + i;
								if (i == length || HEAPU8[currentBytePtr] == 0) {
									var maxRead = currentBytePtr - decodeStartPtr;
									var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
									if (str === void 0) str = stringSegment;
									else {
										str += String.fromCharCode(0);
										str += stringSegment;
									}
									decodeStartPtr = currentBytePtr + 1;
								}
							}
						} else {
							var a = new Array(length);
							for (var i = 0; i < length; ++i) a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
							str = a.join("");
						}
						_free(value);
						return str;
					},
					"toWireType": function(destructors, value) {
						if (value instanceof ArrayBuffer) value = new Uint8Array(value);
						var getLength;
						var valueIsOfTypeString = typeof value == "string";
						if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) throwBindingError("Cannot pass non-string to std::string");
						if (stdStringIsUTF8 && valueIsOfTypeString) getLength = (() => lengthBytesUTF8(value));
						else getLength = (() => value.length);
						var length = getLength();
						var ptr = _malloc(4 + length + 1);
						HEAPU32[ptr >> 2] = length;
						if (stdStringIsUTF8 && valueIsOfTypeString) stringToUTF8(value, ptr + 4, length + 1);
						else if (valueIsOfTypeString) for (var i = 0; i < length; ++i) {
							var charCode = value.charCodeAt(i);
							if (charCode > 255) {
								_free(ptr);
								throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
							}
							HEAPU8[ptr + 4 + i] = charCode;
						}
						else for (var i = 0; i < length; ++i) HEAPU8[ptr + 4 + i] = value[i];
						if (destructors !== null) destructors.push(_free, ptr);
						return ptr;
					},
					"argPackAdvance": 8,
					"readValueFromPointer": simpleReadValueFromPointer,
					destructorFunction: function(ptr) {
						_free(ptr);
					}
				});
			}
			function __embind_register_std_wstring(rawType, charSize, name) {
				name = readLatin1String(name);
				var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
				if (charSize === 2) {
					decodeString = UTF16ToString;
					encodeString = stringToUTF16;
					lengthBytesUTF = lengthBytesUTF16;
					getHeap = (() => HEAPU16);
					shift = 1;
				} else if (charSize === 4) {
					decodeString = UTF32ToString;
					encodeString = stringToUTF32;
					lengthBytesUTF = lengthBytesUTF32;
					getHeap = (() => HEAPU32);
					shift = 2;
				}
				registerType(rawType, {
					name,
					"fromWireType": function(value) {
						var length = HEAPU32[value >> 2];
						var HEAP = getHeap();
						var str;
						var decodeStartPtr = value + 4;
						for (var i = 0; i <= length; ++i) {
							var currentBytePtr = value + 4 + i * charSize;
							if (i == length || HEAP[currentBytePtr >> shift] == 0) {
								var maxReadBytes = currentBytePtr - decodeStartPtr;
								var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
								if (str === void 0) str = stringSegment;
								else {
									str += String.fromCharCode(0);
									str += stringSegment;
								}
								decodeStartPtr = currentBytePtr + charSize;
							}
						}
						_free(value);
						return str;
					},
					"toWireType": function(destructors, value) {
						if (!(typeof value == "string")) throwBindingError("Cannot pass non-string to C++ string type " + name);
						var length = lengthBytesUTF(value);
						var ptr = _malloc(4 + length + charSize);
						HEAPU32[ptr >> 2] = length >> shift;
						encodeString(value, ptr + 4, length + charSize);
						if (destructors !== null) destructors.push(_free, ptr);
						return ptr;
					},
					"argPackAdvance": 8,
					"readValueFromPointer": simpleReadValueFromPointer,
					destructorFunction: function(ptr) {
						_free(ptr);
					}
				});
			}
			function __embind_register_void(rawType, name) {
				name = readLatin1String(name);
				registerType(rawType, {
					isVoid: true,
					name,
					"argPackAdvance": 0,
					"fromWireType": function() {},
					"toWireType": function(destructors, o) {}
				});
			}
			function __emval_as(handle, returnType, destructorsRef) {
				handle = Emval.toValue(handle);
				returnType = requireRegisteredType(returnType, "emval::as");
				var destructors = [];
				var rd = Emval.toHandle(destructors);
				HEAP32[destructorsRef >> 2] = rd;
				return returnType["toWireType"](destructors, handle);
			}
			var emval_symbols = {};
			function getStringOrSymbol(address) {
				var symbol = emval_symbols[address];
				if (symbol === void 0) return readLatin1String(address);
				else return symbol;
			}
			var emval_methodCallers = [];
			function __emval_call_void_method(caller, handle, methodName, args) {
				caller = emval_methodCallers[caller];
				handle = Emval.toValue(handle);
				methodName = getStringOrSymbol(methodName);
				caller(handle, methodName, null, args);
			}
			function emval_get_global() {
				if (typeof globalThis == "object") return globalThis;
				return function() {
					return Function;
				}()("return this")();
			}
			function __emval_get_global(name) {
				if (name === 0) return Emval.toHandle(emval_get_global());
				else {
					name = getStringOrSymbol(name);
					return Emval.toHandle(emval_get_global()[name]);
				}
			}
			function __emval_addMethodCaller(caller) {
				var id = emval_methodCallers.length;
				emval_methodCallers.push(caller);
				return id;
			}
			function __emval_lookupTypes(argCount, argTypes) {
				var a = new Array(argCount);
				for (var i = 0; i < argCount; ++i) a[i] = requireRegisteredType(HEAP32[(argTypes >> 2) + i], "parameter " + i);
				return a;
			}
			var emval_registeredMethods = [];
			function __emval_get_method_caller(argCount, argTypes) {
				var types = __emval_lookupTypes(argCount, argTypes);
				var retType = types[0];
				var signatureName = retType.name + "_$" + types.slice(1).map(function(t) {
					return t.name;
				}).join("_") + "$";
				var returnId = emval_registeredMethods[signatureName];
				if (returnId !== void 0) return returnId;
				var params = ["retType"];
				var args = [retType];
				var argsList = "";
				for (var i = 0; i < argCount - 1; ++i) {
					argsList += (i !== 0 ? ", " : "") + "arg" + i;
					params.push("argType" + i);
					args.push(types[1 + i]);
				}
				var functionBody = "return function " + makeLegalFunctionName("methodCaller_" + signatureName) + "(handle, name, destructors, args) {\n";
				var offset = 0;
				for (var i = 0; i < argCount - 1; ++i) {
					functionBody += "    var arg" + i + " = argType" + i + ".readValueFromPointer(args" + (offset ? "+" + offset : "") + ");\n";
					offset += types[i + 1]["argPackAdvance"];
				}
				functionBody += "    var rv = handle[name](" + argsList + ");\n";
				for (var i = 0; i < argCount - 1; ++i) if (types[i + 1]["deleteObject"]) functionBody += "    argType" + i + ".deleteObject(arg" + i + ");\n";
				if (!retType.isVoid) functionBody += "    return retType.toWireType(destructors, rv);\n";
				functionBody += "};\n";
				params.push(functionBody);
				returnId = __emval_addMethodCaller(new_(Function, params).apply(null, args));
				emval_registeredMethods[signatureName] = returnId;
				return returnId;
			}
			function __emval_get_property(handle, key) {
				handle = Emval.toValue(handle);
				key = Emval.toValue(key);
				return Emval.toHandle(handle[key]);
			}
			function __emval_incref(handle) {
				if (handle > 4) emval_handle_array[handle].refcount += 1;
			}
			function __emval_instanceof(object, constructor) {
				object = Emval.toValue(object);
				constructor = Emval.toValue(constructor);
				return object instanceof constructor;
			}
			function __emval_new_cstring(v) {
				return Emval.toHandle(getStringOrSymbol(v));
			}
			function __emval_run_destructors(handle) {
				runDestructors(Emval.toValue(handle));
				__emval_decref(handle);
			}
			function __emval_take_value(type, argv) {
				type = requireRegisteredType(type, "_emval_take_value");
				var v = type["readValueFromPointer"](argv);
				return Emval.toHandle(v);
			}
			function __emval_typeof(handle) {
				handle = Emval.toValue(handle);
				return Emval.toHandle(typeof handle);
			}
			function _abort() {
				abort("");
			}
			function _emscripten_memcpy_big(dest, src, num) {
				HEAPU8.copyWithin(dest, src, src + num);
			}
			function _emscripten_get_heap_max() {
				return 2147483648;
			}
			function emscripten_realloc_buffer(size) {
				try {
					wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
					updateGlobalBufferAndViews(wasmMemory.buffer);
					return 1;
				} catch (e) {}
			}
			function _emscripten_resize_heap(requestedSize) {
				var oldSize = HEAPU8.length;
				requestedSize = requestedSize >>> 0;
				var maxHeapSize = _emscripten_get_heap_max();
				if (requestedSize > maxHeapSize) return false;
				let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
				for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
					var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
					overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
					if (emscripten_realloc_buffer(Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)))) return true;
				}
				return false;
			}
			embind_init_charCodes();
			BindingError = Module["BindingError"] = extendError(Error, "BindingError");
			InternalError = Module["InternalError"] = extendError(Error, "InternalError");
			init_ClassHandle();
			init_embind();
			init_RegisteredPointer();
			UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
			init_emval();
			var ASSERTIONS = false;
			function intArrayToString(array) {
				var ret = [];
				for (var i = 0; i < array.length; i++) {
					var chr = array[i];
					if (chr > 255) {
						if (ASSERTIONS) assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.");
						chr &= 255;
					}
					ret.push(String.fromCharCode(chr));
				}
				return ret.join("");
			}
			var decodeBase64 = typeof atob == "function" ? atob : function(input) {
				var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
				var output = "";
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				do {
					enc1 = keyStr.indexOf(input.charAt(i++));
					enc2 = keyStr.indexOf(input.charAt(i++));
					enc3 = keyStr.indexOf(input.charAt(i++));
					enc4 = keyStr.indexOf(input.charAt(i++));
					chr1 = enc1 << 2 | enc2 >> 4;
					chr2 = (enc2 & 15) << 4 | enc3 >> 2;
					chr3 = (enc3 & 3) << 6 | enc4;
					output = output + String.fromCharCode(chr1);
					if (enc3 !== 64) output = output + String.fromCharCode(chr2);
					if (enc4 !== 64) output = output + String.fromCharCode(chr3);
				} while (i < input.length);
				return output;
			};
			function intArrayFromBase64(s) {
				if (typeof ENVIRONMENT_IS_NODE == "boolean" && ENVIRONMENT_IS_NODE) {
					var buf = Buffer.from(s, "base64");
					return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"]);
				}
				try {
					var decoded = decodeBase64(s);
					var bytes = new Uint8Array(decoded.length);
					for (var i = 0; i < decoded.length; ++i) bytes[i] = decoded.charCodeAt(i);
					return bytes;
				} catch (_) {
					throw new Error("Converting base64 string to bytes failed.");
				}
			}
			function tryParseAsDataURI(filename) {
				if (!isDataURI(filename)) return;
				return intArrayFromBase64(filename.slice(dataURIPrefix.length));
			}
			var asmLibraryArg = {
				"a": ___assert_fail,
				"n": ___cxa_allocate_exception,
				"m": ___cxa_throw,
				"y": __embind_register_bigint,
				"C": __embind_register_bool,
				"F": __embind_register_class,
				"E": __embind_register_class_constructor,
				"c": __embind_register_class_function,
				"B": __embind_register_emval,
				"o": __embind_register_enum,
				"h": __embind_register_enum_value,
				"w": __embind_register_float,
				"e": __embind_register_integer,
				"b": __embind_register_memory_view,
				"v": __embind_register_std_string,
				"l": __embind_register_std_wstring,
				"D": __embind_register_void,
				"g": __emval_as,
				"p": __emval_call_void_method,
				"d": __emval_decref,
				"r": __emval_get_global,
				"j": __emval_get_method_caller,
				"s": __emval_get_property,
				"i": __emval_incref,
				"q": __emval_instanceof,
				"u": __emval_new_cstring,
				"f": __emval_run_destructors,
				"k": __emval_take_value,
				"x": __emval_typeof,
				"t": _abort,
				"A": _emscripten_memcpy_big,
				"z": _emscripten_resize_heap
			};
			createWasm();
			var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
				return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["H"]).apply(null, arguments);
			};
			var ___getTypeName = Module["___getTypeName"] = function() {
				return (___getTypeName = Module["___getTypeName"] = Module["asm"]["J"]).apply(null, arguments);
			};
			var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function() {
				return (___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = Module["asm"]["K"]).apply(null, arguments);
			};
			var _malloc = Module["_malloc"] = function() {
				return (_malloc = Module["_malloc"] = Module["asm"]["L"]).apply(null, arguments);
			};
			var _free = Module["_free"] = function() {
				return (_free = Module["_free"] = Module["asm"]["M"]).apply(null, arguments);
			};
			var calledRun;
			function ExitStatus(status) {
				this.name = "ExitStatus";
				this.message = "Program terminated with exit(" + status + ")";
				this.status = status;
			}
			dependenciesFulfilled = function runCaller() {
				if (!calledRun) run();
				if (!calledRun) dependenciesFulfilled = runCaller;
			};
			function run(args) {
				args = args || arguments_;
				if (runDependencies > 0) return;
				preRun();
				if (runDependencies > 0) return;
				function doRun() {
					if (calledRun) return;
					calledRun = true;
					Module["calledRun"] = true;
					if (ABORT) return;
					initRuntime();
					readyPromiseResolve(Module);
					if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
					postRun();
				}
				if (Module["setStatus"]) {
					Module["setStatus"]("Running...");
					setTimeout(function() {
						setTimeout(function() {
							Module["setStatus"]("");
						}, 1);
						doRun();
					}, 1);
				} else doRun();
			}
			Module["run"] = run;
			if (Module["preInit"]) {
				if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
				while (Module["preInit"].length > 0) Module["preInit"].pop()();
			}
			run();
			return Module.ready;
		});
	})();
	if (typeof exports === "object" && typeof module === "object") module.exports = Module;
	else if (typeof define === "function" && define["amd"]) define([], function() {
		return Module;
	});
	else if (typeof exports === "object") exports["Module"] = Module;
})))());
//#endregion
Object.defineProperty(exports, "ClockFrequencyHz", {
	enumerable: true,
	get: function() {
		return ClockFrequencyHz_exports;
	}
});
exports.ContinuousController = ContinuousController;
exports.Processor = Processor;
exports.SidChipAdapter = SidChipAdapter;
Object.defineProperty(exports, "createSIDModule", {
	enumerable: true,
	get: function() {
		return import_libresidfp.default;
	}
});
