# companion-module-datasat-ap20-ap25

[![Companion Module Checks](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/actions/workflows/companion-module-checks.yaml/badge.svg?branch=main)](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/actions/workflows/companion-module-checks.yaml)
[![CodeQL](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A [Bitfocus Companion](https://bitfocus.io/companion) module to control the **Datasat AP20 and AP25** cinema audio processors over Ethernet (TCP port 14500).

Implements the Datasat Remote Command API (document TN-H413 rev D) and the extra commands that real units accept, such as `@POWER`.

## Features

- Master fader control (absolute + relative), master mute
- Format selection with feedback, as a dropdown filled with the formats on the unit
- Macro execution, as a dropdown filled with the macros on the unit
- Power ON / Standby / Toggle with the real power state and a start-up indication
- Monitor level and monitor mute
- Screensaver control and GPIO pulse output
- Board temperatures, per-board supply voltage status, phantom power and CPU supply monitoring
- Password authentication (NetCmd / Setup)
- Status polling so buttons stay in sync with changes made on the device
- Presets for common buttons, plus one button per format and macro of your unit
- Detects what your particular unit supports and falls back gracefully
- Custom command action that shows the answer of the unit in the log

## Installation

### From a release

1. Download `pkg.tgz` from the [latest release](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/releases).
2. Extract it into your Companion developer modules folder.
3. In Companion, go to **Settings > Developer** and point the developer modules path at the folder _containing_ the extracted module folder.
4. Add a new connection and search for "Datasat".

### From source

1. Install [Node.js 22](https://nodejs.org/) and enable corepack: `corepack enable`
2. Clone this repository into your Companion developer modules folder:

   ```
   git clone https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25.git
   cd companion-module-datasat-ap20-ap25
   yarn install
   ```

3. In Companion, go to **Settings > Developer** and set the developer modules path to the folder _containing_ this repo.
4. Add a new connection and search for "Datasat".

## Device setup

- Connect the AP20/AP25 Ethernet port to your network and note the IP address (Network screen on the device).
- If a NetCmd or Setup password is set under _System > Access Control_, enter it in the module config.

## Development

```
yarn install    # install dependencies
yarn check      # validate companion/manifest.json and the module definitions
yarn format     # apply prettier formatting
yarn package    # build pkg.tgz for distribution
```

Every push runs the shared Bitfocus module checks, the same validation used by the official Companion module library, plus a CodeQL analysis.

## Documentation

See [companion/HELP.md](companion/HELP.md) for the in-app help text with all actions, feedbacks, variables and presets.

## License

MIT, see [LICENSE](LICENSE).

## Disclaimer

This module is not affiliated with Datasat Digital Entertainment. Datasat, AP20 and AP25 are trademarks of their respective owners.
