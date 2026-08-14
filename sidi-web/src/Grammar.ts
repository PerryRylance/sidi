import { ControllerEvent, ControllerType } from "@perry-rylance/midi";

const globalEventsChannel = 0;

abstract class OscillatorControllerEvent<C extends ControllerType, V extends number = number> extends ControllerEvent<C, V>
{
    protected assertValidChannel(channel: number): void
    {
        this.assertUnsignedAndBelow(channel, 3);
    }
}

abstract class ToggleControllerEvent<C extends ControllerType> extends ControllerEvent<C>
{
    get enabled(): boolean
    {
        return this.value >= 0x40;
    }

    set enabled(enable: boolean)
    {
        this.value = enable ? 0x7f : 0;
    }
}

abstract class OscillatorToggleControllerEvent<C extends ControllerType> extends OscillatorControllerEvent<C>
{
    get enabled(): boolean
    {
        return this.value >= 0x40;
    }

    set enabled(enable: boolean)
    {
        this.value = enable ? 0x7f : 0;
    }
}

export class FilterResonanceEvent extends ControllerEvent<71>
{
    constructor(delta?: number, value: number = 0)
    {
        super(delta, globalEventsChannel, 71, value);
    }
}

export class FilterCutoffEvent extends ControllerEvent<74>
{
    constructor(delta?: number, value: number = 0)
    {
        super(delta, globalEventsChannel, 74, value);
    }
}

export class PulseWidthEvent extends OscillatorControllerEvent<75>
{
    constructor(delta?: number, oscillator: number = 0, value: number = 0)
    {
        super(delta, oscillator, 75, value);
    }
}

export class AttackEvent extends OscillatorControllerEvent<76>
{
    constructor(delta?: number, oscillator: number = 0, value: number = 0)
    {
        super(delta, oscillator, 76, value);
    }
}

export class DecayEvent extends OscillatorControllerEvent<77>
{
    constructor(delta?: number, oscillator: number = 0, value: number = 0)
    {
        super(delta, oscillator, 77, value);
    }
}

export class SustainEvent extends OscillatorControllerEvent<78>
{
    constructor(delta?: number, oscillator: number = 0, value: number = 0)
    {
        super(delta, oscillator, 78, value);
    }
}

export class ReleaseEvent extends OscillatorControllerEvent<79>
{
    constructor(delta?: number, oscillator: number = 0, value: number = 0)
    {
        super(delta, oscillator, 79, value);
    }
}

export class TriangleEvent extends OscillatorToggleControllerEvent<80>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 80);
        this.enabled = enable;
    }
}

export class SawEvent extends OscillatorToggleControllerEvent<81>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 81);
        this.enabled = enable;
    }
}

export class PulseEvent extends OscillatorToggleControllerEvent<82>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 82);
        this.enabled = enable;
    }
}

export class NoiseEvent extends OscillatorToggleControllerEvent<83>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 83);
        this.enabled = enable;
    }
}

export class GateEvent extends OscillatorToggleControllerEvent<84>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 84);
        this.enabled = enable;
    }
}

export class SyncEvent extends OscillatorToggleControllerEvent<85>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 85);
        this.enabled = enable;
    }
}

export class RingEvent extends OscillatorToggleControllerEvent<86>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 86);
        this.enabled = enable;
    }
}

export class TestEvent extends OscillatorToggleControllerEvent<87>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 87);
        this.enabled = enable;
    }
}

export class FilterEnableEvent extends OscillatorToggleControllerEvent<88>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 88);
        this.enabled = enable;
    }
}

export class FilterLowPassEvent extends ToggleControllerEvent<89>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 89);
        this.enabled = enable;
    }
}

export class FilterBandPassEvent extends ToggleControllerEvent<90>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 90);
        this.enabled = enable;
    }
}

export class FilterHighPassEvent extends ToggleControllerEvent<91>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 91);
        this.enabled = enable;
    }
}

export class Oscillator3MuteEvent extends ToggleControllerEvent<92>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 92);
        this.enabled = enable;
    }
}

export class AdsrWorkaroundGlobalEvent extends ToggleControllerEvent<93>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 93);
        this.enabled = enable;
    }
}

export class AdsrWorkaroundChannelEvent extends OscillatorToggleControllerEvent<94>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 94);
        this.enabled = enable;
    }
}

export class MainVolumeEvent extends ControllerEvent<7>
{
    constructor(delta?: number, value: number = 0)
    {
        super(delta, globalEventsChannel, 7, value);
    }
}
