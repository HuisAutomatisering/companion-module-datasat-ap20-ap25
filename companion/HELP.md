# Datasat AP20 / AP25

This module controls the Datasat AP20 and AP25 cinema audio processors over Ethernet (TCP port 14500), based on the Datasat Remote Command API (TN-H413 rev D).

## Configuration

- **IP Address**: The IP of the AP20/AP25. Find it on the device under the Network screen.
- **Password**: Only needed if a NetCmd or Setup password is set under *System > Access Control* on the device. Leave empty otherwise. The module sends `@AUTH` automatically on connect.
- **Poll interval**: How often the module reads fader/mute/format status to keep variables and feedbacks in sync with changes made on the device itself. Set to 0 to disable.

## Actions

- Set Master Fader Level (0.0 - 10.0)
- Adjust Master Fader relative (e.g. +0.5 / -0.5)
- Master Mute (mute / unmute / toggle)
- Select Format (name must match the format name on the device exactly)
- Run Macro (name must match the macro name on the device exactly)
- Set Monitor Level (0 - 100)
- Monitor Mute (mute / unmute / toggle)
- Send Custom Command (any command from the API doc, without the leading `@`)

## Feedbacks

- Master output muted
- Monitor muted
- Current format matches a given name
- Fader level comparison (=, >, <)

## Variables

`fader`, `fader_raw`, `muted`, `format`, `monitor_level`, `monitor_mute`, `version`, `serial`

## Notes

- Format and macro names are case sensitive and may contain spaces.
- The AP20/AP25 applies changes immediately on receiving a command.
