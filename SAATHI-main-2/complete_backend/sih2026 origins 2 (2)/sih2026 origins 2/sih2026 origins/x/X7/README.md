# Module X7: Voice Query Support & Audio Normalization

## Overview
Module X7 provides speech-to-text transcription (via Bhashini ULCA / Whisper), Indian phonetic normalization, intent inference, and text-to-speech audio synthesis for low-literacy users.

## Key Capabilities
- **Indian Phonetic & Numeral Normalization**: Normalizes Hindi spoken numerals, Devanagari digits ("१०५००" ➔ "10500"), and conversational terms.
- **Bhashini & Whisper STT Client**: Transcribes Hindi, English, and regional Indian voice queries.
- **TTS Speech Synthesis**: Returns synthesized spoken audio for citizen accessibility.
- **Confidence-Based Reprompt**: Detects noisy audio or ambiguous speech and prompts user clarification.

## Endpoints
- `POST /voice/transcribe-and-normalize`
- `POST /voice/normalize-text`
- `POST /voice/synthesize-speech`
