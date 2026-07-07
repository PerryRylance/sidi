# Standalone build for the MIDI interpretation test suite.
#
# This is deliberately independent of the Projucer/VS2026 plugin build -
# these tests need only juce_core (no audio device, no VST3 SDK), so a
# plain Makefile keeps the loop fast on any Linux/WSL box with JUCE cloned
# locally. Override JUCE_DIR if your checkout lives elsewhere.
#
#   make JUCE_DIR=/path/to/JUCE test

JUCE_DIR ?= $(HOME)/JUCE
JUCE_MODULES := $(JUCE_DIR)/modules

CXX ?= g++
CXXFLAGS := -std=c++17 -Wall -Wextra \
            -I$(JUCE_MODULES) -I. \
            -DJUCE_GLOBAL_MODULE_SETTINGS_INCLUDED=1 \
            -DJUCE_STANDALONE_APPLICATION=1 \
            -DJUCE_USE_CURL=0

LDLIBS := -lpthread -ldl -lrt

BUILD_DIR := build

TEST_SOURCES := \
    NotePitchInterpretationTests.cpp \
    PulseWidthInterpretationTests.cpp \
    WaveformInterpretationTests.cpp \
    ControlBitsInterpretationTests.cpp \
    AdsrEnvelopeInterpretationTests.cpp \
    NoteControlInterpretationTests.cpp \
    FilterInterpretationTests.cpp \
    VolumeInterpretationTests.cpp \
    PitchBendAndRpnRangeInterpretationTests.cpp

OBJECTS := \
    $(BUILD_DIR)/JuceCoreModule.o \
    $(BUILD_DIR)/juce_core_CompilationTime.o \
    $(BUILD_DIR)/MidiInterpreter.o \
    $(BUILD_DIR)/Main.o \
    $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(TEST_SOURCES))

TARGET := $(BUILD_DIR)/sidi-vst-tests

.PHONY: all test clean

all: $(TARGET)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/%.o: %.cpp | $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(BUILD_DIR)/JuceCoreModule.o: Support/JuceCoreModule.cpp | $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(BUILD_DIR)/MidiInterpreter.o: ../Source/MidiInterpreter.cpp | $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(BUILD_DIR)/juce_core_CompilationTime.o: $(JUCE_MODULES)/juce_core/juce_core_CompilationTime.cpp | $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(TARGET): $(OBJECTS)
	$(CXX) $(OBJECTS) -o $@ $(LDLIBS)

test: $(TARGET)
	./$(TARGET)

clean:
	rm -rf $(BUILD_DIR)
