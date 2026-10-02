# Datasat AP20 / AP25

This module controls the Datasat AP20 and AP25 cinema audio processors over Ethernet (TCP port 14500), based on the Datasat Remote Command API (TN-H413 rev D) plus a few commands that real units accept but the API document does not list (`@POWER`, `@FORMATNAMES`, `@MACRONAMES`, `@SCR`, `@PULSE`).

## Configuration

- **IP Address**: The IP of the AP20/AP25. Find it on the device under the Network screen.
- **Password**: Only needed if a NetCmd or Setup password is set under _System > Access Control_ on the device. Leave empty otherwise. The module sends `@AUTH` automatically on connect.
- **Status poll interval**: How often the module reads fader, mute, format, monitor and power state to keep variables and feedbacks in sync with changes made on the device itself. Set to 0 to disable.
- **Temperature / voltage poll interval**: How often (in seconds) the board temperatures and supply voltages are read. Set to 0 to disable.
- **Fallback Power ON / Standby macro**: Only used when the unit does not support `@POWER`. Leave empty on units that do.

## What the module detects

On connect the module asks the unit which of the extra commands it understands. A unit answers `BadCommand` to anything it does not know. Only that answer counts as "not supported": if the unit does not answer in time (for example while it is starting up) the module asks again later.

- `@POWER` available: Power ON / Standby / Toggle switch the unit directly and the power state is shown.
- `@FORMATNAMES` / `@MACRONAMES` available: the Select Format and Run Macro actions become dropdowns filled with the names on the unit, and a preset button is created for every format and macro.
- Not available: the actions fall back to a text field (the name must match the name on the unit exactly) and the Power actions use the fallback macros.

While the unit is in standby only its power state is polled. The format and macro lists are read as soon as the unit is operating.

## Actions

- Set Master Fader Level (0.0 - 10.0)
- Adjust Master Fader relative (e.g. +0.5 / -0.5)
- Master Mute (mute / unmute / toggle)
- Select Format
- Run Macro
- Set Monitor Level (0 - 100)
- Monitor Mute (mute / unmute / toggle)
- Power ON, Standby, Power Toggle (the unit needs about 15 seconds to become operational after Power ON)
- Screensaver (wake the display or activate the screensaver)
- GPIO Pulse (250 ms pulse on GPIO 1 - 21)
- Send Custom Command (any command from the API doc, without the leading `@`). The answer of the unit is written to the Companion log.

## Feedbacks

- Master output muted
- Monitor muted
- Current format matches a given name
- Fader level comparison (=, >, <)
- Unit power state (on, starting, standby)
- Supply voltage fault (any board, a specific board, or the CPU supply)
- Microphone phantom power on

## Variables

`fader`, `fader_raw`, `muted`, `format`, `monitor_level`, `monitor_mute`, `power_state`, `temp1`, `temp2`, `temp3`, `power`, `power_faults`, `board_h331`, `board_h332`, `board_h335`, `board_h336`, `board_h338`, `phantom`, `cpu_power`, `version`, `serial`

- `temp1`, `temp2`, `temp3` are the H331, H332 and H335 board temperatures in °C.
- `power` is the overall supply voltage status (OK / FAULT) and `power_faults` lists the boards with a fault.
- `board_*` show OK, FAULT or N/A (board not fitted).

## Notes

- Format and macro names are case sensitive and may contain spaces.
- The AP20/AP25 applies changes immediately on receiving a command.
- The unit has no `@VOLUME` command (it answers `BadCommand`); use the master fader, which works in tenths.
- Debug logging in Companion shows every command and answer. Passwords are masked.
