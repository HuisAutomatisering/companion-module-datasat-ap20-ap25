# companion-module-datasat-ap20-ap25

A [Bitfocus Companion](https://bitfocus.io/companion) module to control the **Datasat AP20 and AP25** cinema audio processors over Ethernet (TCP port 14500).

Implements the Datasat Remote Command API (document TN-H413 rev D).

## Features

- Master fader control (absolute + relative), master mute
- Format selection with feedback
- Macro execution
- Monitor level and monitor mute
- Password authentication (NetCmd / Setup)
- Status polling so buttons stay in sync with changes made on the device
- Presets for common buttons (mute toggle, volume up/down, reference level 7.0)
- Custom command action for anything else in the API

## Installation (as a dev module in your own Companion)

1. Install [Node.js 22](https://nodejs.org/) and enable corepack: `corepack enable`
2. Clone this repository into your Companion developer modules folder:
   ```
   git clone https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25.git
   cd companion-module-datasat-ap20-ap25
   yarn install
   ```
3. In Companion, go to **Settings > Developer** and set the developer modules path to the folder *containing* this repo.
4. Add a new connection and search for "Datasat".

## Device setup

- Connect the AP20/AP25 Ethernet port to your network and note the IP address (Network screen on the device).
- If a NetCmd or Setup password is set under *System > Access Control*, enter it in the module config.

## License

MIT — see [LICENSE](LICENSE).

## Disclaimer

This module is not affiliated with Datasat Digital Entertainment. Datasat, AP20 and AP25 are trademarks of their respective owners.
