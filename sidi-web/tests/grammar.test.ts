import { test, expect } from 'vitest';

import { FilterResonanceEvent, PulseWidthEvent } from "../src/Grammar";

test("Grammar sets expected controller type", () => {

    const event = new FilterResonanceEvent();

    expect(event.controller).toEqualValue(71);

});

test("Grammar sets expected channel for oscillator", () => {

    const event = new PulseWidthEvent(0, 1, 0x40);

    expect(event.channel).toEqualValue(1);
    expect(event.value).toEqualValue(0x40);

});
