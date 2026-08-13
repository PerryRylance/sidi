# sidi
A MIDI interface for the MOS Technology 6581/8580 SID chip by Bob Yannes, used to drive a [reSID emulator](https://github.com/libsidplayfp/resid). This project includes a VST for use in your favourite DAW, and a web interface for driving a SID emulator in a browser environment using MIDI data.

The intention behind this is to give users a popular standard through which to interact with the chip, and to give them more control over the chip than convential tracker software typically allows, especially in enviroments that can be configured with a very high PPQN.

## Usage

### Quick start
- Download the VST build from [releases](https://github.com/PerryRylance/sidi/releases) and install.
- Add the VST to a track in your DAW.
- Send MIDI CC 81 to channel 1 to select the saw waveform.
- Send a note on event to trigger audio output from the SID.

### Oscillators
The SID chip has three oscillators, this interface exposes them via MIDI channels 1 - 3.

Most MIDI CC messages are channel specific, with some exceptions listed in the controller table.

### Controllers
This table details how MIDI CC messages are mapped to the SID's internal registers. Channel specific CC messages are per-oscillator, "any" channel CC messages affect the entire sound.

Controllers which are `continuous` use the full range of the controlleres parameter value. Controllers which are `toggle` are __off__ when <= 63 and __on__ when >= 64.

| CC  | Name                             | Function                                                                   | Channel | Mode       |
|-----|----------------------------------|----------------------------------------------------------------------------|---------|------------|
| 6   | Data Entry MSB                   | Sets pitch bend range in semitones (when RPN 0 is selected via CC 100/101) | 1 - 3   | continuous |
| 7   | Main Volume                      | Master volume                                                              | Any     | continuous |
| 71  | Filter Resonance                 | Filter resonance                                                           | Any     | continuous |
| 74  | Filter Cutoff                    | Filter cutoff frequency                                                    | Any     | continuous |
| 75  | Pulse Width                      | Oscillator pulse width                                                     | 1 - 3   | continuous |
| 76  | Attack                           | Envelope attack                                                            | 1 - 3   | continuous |
| 77  | Decay                            | Envelope decay                                                             | 1 - 3   | continuous |
| 78  | Sustain                          | Envelope sustain                                                           | 1 - 3   | continuous |
| 79  | Release                          | Envelope release                                                           | 1 - 3   | continuous |
| 80  | Triangle                         | Selects the triangle waveform                                              | 1 - 3   | toggle     |
| 81  | Sawtooth                         | Selects the sawtooth waveform                                              | 1 - 3   | toggle     |
| 82  | Pulse                            | Selects the pulse waveform                                                 | 1 - 3   | toggle     |
| 83  | Noise                            | Selects the noise waveform                                                 | 1 - 3   | toggle     |
| 84  | Gate                             | Gate bit (also set automatically by note on/off events)                    | 1 - 3   | toggle     |
| 85  | Sync                             | Oscillator hard sync                                                       | 1 - 3   | toggle     |
| 86  | Ring                             | Ring modulation                                                            | 1 - 3   | toggle     |
| 87  | Test                             | Test bit                                                                   | 1 - 3   | toggle     |
| 88  | Filter Enable                    | Routes the oscillator's output into the filter                             | 1 - 3   | toggle     |
| 89  | Filter Low Pass                  | Enables the filter's low pass mode                                         | Any     | toggle     |
| 90  | Filter Band Pass                 | Enables the filter's band pass mode                                        | Any     | toggle     |
| 91  | Filter High Pass                 | Enables the filter's high pass mode                                        | Any     | toggle     |
| 92  | Oscillator 3 Mute                | Disconnects oscillator 3's output from the mixer                           | Any     | toggle     |
| 93  | ADSR workaround mode             | Enables per-oscillator ADSR workaround (see below)                         | Any     | toggle     |
| 94  | ADSR workaround (per oscillator) | Enables the oscillator ADSR workaround on a specific oscillator            | 1 - 3   | toggle     |
| 100 | RPN LSB                          | Selects an RPN parameter (LSB), used with CC 101 and CC 6                  | 1 - 3   | continuous |
| 101 | RPN MSB                          | Selects an RPN parameter (MSB), used with CC 100 and CC 6                  | 1 - 3   | continuous |

## Mechanisms
- Sidi automatically sets the oscillator frequency based on MIDI note on event pitches.
- Sidi automatically turns on the `GATE` bit when a MIDI note on message is received.
- Sidi is monophonic, and will track the last note on key per channel, turning of the `GATE` bit when the most recent key pressed is released.

### ADSR workaround
Since [libresidfp](https://github.com/libsidplayfp/libresidfp) is a faithful reproduction of the SID, it features the infamous [ADSR quirk](https://csdb.dk/forums/?roomid=14&topicid=27340&showallposts=1), which you may experience by re-triggering notes whilst changing the envelope parameters - this sometimes creates a ~30ms delay effect which is especially noticable when trying to leverage a single oscillator for percussive patterns of varying timbre.

Sidi provides CC's 93 and 94 as a workaround. Set CC 93 on (>= 64) to enable the mode globally. You can then toggle the workaround on and off per-oscillator using CC 94.

When enabled (both globally and on a specific oscillator), this workaround will automatically perform a "hard restart":

- At the end of the notes release
- ~30ms before the next note on

Whichever comes first.

> ⚠️ Enabling the ADSR workaround globally causes a brief, one-off ~33ms silence in the plugin's output at the moment it engages. This isn't an ongoing latency and the plugin does not ask your DAW to offset for it.
> ⚠️ Enabling the ADSR workaround on an oscillator will create an audible silence of ~30ms before the following note is triggered.

## Building

### VST
TODO: Instructions on how to do a JUCE build

### Web
`libresidfp-main` is a git submodule, so after cloning run:
```
git submodule update --init
node scripts/setup-libresidfp.js
```
This checks out the pinned libresidfp commit, applies the Emscripten single-threaded filter-init patch (`patches/0001-emscripten-single-threaded-filter-init.patch`), and generates the config headers libresidfp's autotools build would normally produce (`siddefs-fp.h`, `residfp/sidversion.h`).

With an [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html) on your `PATH`, build the WASM module from `sidi-web`:
```
npm run build:wasm
```
This compiles `sidi-web/agents/SID_bindings.cpp` against `../libresidfp-main` into `sidi-web/compiled/libresidfp.js`.

TODO: Instructions on how to build JS module for bundling

## Limitations
- MIDI 1.0 CC message parameters are 7 bit numbers, many of the SID chips registers have a higher bit depth than this, and so this interface does not expose the full granularity of the underlying chip.
- MIDI 1.0 pitch bend messages are 14 bit numbers (+/- 7 bits) and will also suffer from degraded granularity versus a real C64 setup especially when using a large pitch bend range.

## Planning
Future versions will:

- Add a sustain pedal to allow the pitch to change whilst keeping within a single envelope.
- Add a reset oscillator CC so that all CR's can be reset.
- Support MIDI 2.0 in order to expose the full granularity of the SID's internal registers.
- Add a "free frequency" mode that will disregard MIDI note on events.

## References
- [SID reference](https://www.oxyron.de/html/registers_sid.html)
- [MIDI CC list](https://anotherproducer.com/online-tools-for-musicians/midi-cc-list/)

TODO: Add sensible defaults to sidi-web
