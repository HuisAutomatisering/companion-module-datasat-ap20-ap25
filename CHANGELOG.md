# Changelog

All notable changes to this module are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.3]

### Fixed

- When the unit did not answer `@POWER` in time while connecting (for example while it was starting up or
  just after a power change), the module decided for good that the unit does not support `@POWER`. The
  Power buttons then reported "does not support @POWER" and the power state disappeared until the module
  was reloaded. Only an explicit `BadCommand` answer now means "not supported". Without an answer the
  module keeps asking while polling, and Power ON / Standby / Toggle send `@POWER` meanwhile.
- The same applies to the format and macro lists: they are only written off after a `BadCommand` answer,
  otherwise they are requested again later.
- An answer that arrives after its timeout is no longer taken for the answer to the next command. This
  could mix up the format and macro lists.

## [2.1.2]

### Changed

- Format and macro preset buttons use one text size and break long names at word boundaries, instead of
  automatic sizing that made some buttons large and others small.
- The Power Toggle preset shows "POWER TOGGLE" with the state as button colour, so it can no longer be
  mistaken for the Power ON preset.

## [2.1.1]

### Fixed

- Units that put the command name in front of the format and macro lists (`FORMATNAMES A,B,C`) showed it
  as part of the first format name. The name is now removed, and a bare `MACRONAMES` answer is read as
  an empty macro list instead of a macro called "MACRONAMES".
- The format and macro lists were requested twice when connecting. They are now requested once.
- Format and macro names are kept exactly as the unit reports them, including a trailing space
  (for example `Spdif `), so the unit recognises them when they are sent back. The "Current format"
  feedback ignores trailing spaces when it compares names.

## [2.1.0]

### Added

- Power ON and Standby now use the unit's own `@POWER` command instead of macros, and a new Power Toggle
  action was added. The real power state is shown in the `power_state` variable (On, Standby, Starting)
  and in the new "Unit power state" feedback. The unit needs about 15 seconds to start; this is shown
  as "Starting".
- The Select Format and Run Macro actions, and the "Current format" feedback, are dropdowns filled with
  the names on the unit (`@FORMATNAMES`, `@MACRONAMES`). A preset button is created for every format and
  macro.
- Screensaver action (`@SCR`) and GPIO Pulse action (`@PULSE`, 250 ms, GPIO 1 - 21).
- Supply monitoring per board (H331, H332, H335, H336, H338) with the variables `board_h331` to
  `board_h338`, plus `phantom` (microphone phantom power), `cpu_power` and `power_faults`.
- Feedbacks for a supply fault on a chosen board or the CPU supply, and for phantom power being on.
- Config option for the temperature / voltage poll interval.
- Presets for Power Toggle, Wake display, Screensaver, supply status, phantom power and temperatures.
- The Send Custom Command action writes the answer of the unit to the Companion log.
- Capability detection on connect: the module learns which of the extra commands the unit accepts
  (an unknown command is answered with `BadCommand`) and falls back to text fields and the power macros
  when a command is missing.

### Changed

- Commands are sent one at a time and every answer is matched to its command. Commands from buttons go
  before status polling. A command that gets no answer no longer disturbs the following ones.
- While the unit is in standby only its power state is polled. The format and macro lists are loaded
  as soon as the unit is operating.
- The "Supply voltage fault" feedback now covers all boards by default and has a board option.
- The Power ON / Standby macro names in the module config are only a fallback for units without
  `@POWER` and are empty by default.
- A network error while the unit is unreachable is logged once as a warning and after that at debug level.
- The password is masked in the debug log.
- CI workflows use `actions/checkout@v5`, `github/codeql-action@v4` and `ubuntu-24.04`.
- Dependabot no longer proposes major version updates of `@companion-module/base` and
  `@companion-module/tools`, which need a deliberate migration of the module code.
- The generic logo was added to the `Brand` folder.

### Fixed

- Preset button texts that show variables now use the actual label of the connection.

## [2.0.1]

### Added

- Shared Bitfocus module checks on every push, via the reusable `bitfocus/actions` workflow. Each run
  also uploads a built `pkg.tgz`.
- CodeQL analysis workflow, weekly and on every push to `main`.
- Dependabot configuration for GitHub Actions and npm dependencies (monthly).
- Issue and pull request templates.
- `SECURITY.md` with a private vulnerability reporting route.
- `Brand/` folder for optional, self-supplied logo assets.
- `yarn check` script for local manifest validation.

### Changed

- Module id renamed to `datasat-ap20-ap25` to match the repository name, as required by the Bitfocus
  module checks. Existing connections migrate automatically via `legacyIds`.
- Manifest `runtime.apiVersion` corrected to `0.0.0`.

## [2.0.0]

### Added

- Power ON and Standby actions, driven by configurable macro names.
- Board temperature variables and power-supply health monitoring, with a feedback for power faults.
- Monitor level and monitor mute actions.
- Custom command action for anything not covered by a dedicated action.
- Presets for mute toggle, volume up/down and reference level 7.0.

### Changed

- Status polling keeps button feedback in sync with changes made on the device front panel.

## [1.0.0]

- Initial release: master fader, master mute, format selection and macro execution over TCP port 14500.
