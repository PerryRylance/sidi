import { ControllerEvent, ControllerType } from "@perry-rylance/midi";

const globalEventsChannel = 0;

function toggleValue(enable: boolean): number
{
    return enable ? 0x7f : 0;
}

abstract class OscillatorControllerEvent<C extends ControllerType, V extends number = number> extends ControllerEvent<C, V>
{
    protected assertValidChannel(channel: number): void
    {
        this.assertUnsignedAndBelow(channel, 3);
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

export class TriangleEvent extends OscillatorControllerEvent<80>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 80, toggleValue(enable));
    }
}

export class SawEvent extends OscillatorControllerEvent<81>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 81, toggleValue(enable));
    }
}

export class PulseEvent extends OscillatorControllerEvent<82>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 82, toggleValue(enable));
    }
}

export class NoiseEvent extends OscillatorControllerEvent<83>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 83, toggleValue(enable));
    }
}

export class GateEvent extends OscillatorControllerEvent<84>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 84, toggleValue(enable));
    }
}

export class SyncEvent extends OscillatorControllerEvent<85>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 85, toggleValue(enable));
    }
}

export class RingEvent extends OscillatorControllerEvent<86>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 86, toggleValue(enable));
    }
}

export class TestEvent extends OscillatorControllerEvent<87>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 87, toggleValue(enable));
    }
}

export class FilterEnableEvent extends OscillatorControllerEvent<88>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 88, toggleValue(enable));
    }
}

export class FilterLowPassEvent extends ControllerEvent<89>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 89, toggleValue(enable));
    }
}

export class FilterBandPassEvent extends ControllerEvent<90>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 90, toggleValue(enable));
    }
}

export class FilterHighPassEvent extends ControllerEvent<91>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 91, toggleValue(enable));
    }
}

export class Oscillator3MuteEvent extends ControllerEvent<92>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 92, toggleValue(enable));
    }
}

export class AdsrWorkaroundGlobalEvent extends ControllerEvent<93>
{
    constructor(delta?: number, enable: boolean = false)
    {
        super(delta, globalEventsChannel, 93, toggleValue(enable));
    }
}

export class AdsrWorkaroundChannelEvent extends OscillatorControllerEvent<94>
{
    constructor(delta?: number, oscillator: number = 0, enable: boolean = false)
    {
        super(delta, oscillator, 94, toggleValue(enable));
    }
}

export class MainVolumeEvent extends ControllerEvent<7>
{
    constructor(delta?: number, value: number = 0)
    {
        super(delta, globalEventsChannel, 7, value);
    }
}
