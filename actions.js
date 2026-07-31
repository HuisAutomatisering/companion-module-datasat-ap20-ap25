export function getActions(self) {
	return {
		setFader: {
			name: 'Set Master Fader Level',
			options: [
				{
					type: 'number',
					id: 'level',
					label: 'Level (0.0 - 10.0)',
					default: 7.0,
					min: 0,
					max: 10,
					step: 0.1,
					range: true,
				},
			],
			callback: (action) => {
				const tenths = Math.round(action.options.level * 10)
				self.sendCommand(`FADER ${tenths}`)
			},
		},

		faderRelative: {
			name: 'Adjust Master Fader (relative)',
			options: [
				{
					type: 'number',
					id: 'delta',
					label: 'Change (+/- in 0.1 steps, e.g. 0.5 or -0.5)',
					default: 0.5,
					min: -10,
					max: 10,
					step: 0.1,
				},
			],
			callback: (action) => {
				let target = self.state.fader + Math.round(action.options.delta * 10)
				target = Math.max(0, Math.min(100, target))
				self.sendCommand(`FADER ${target}`)
			},
		},

		mute: {
			name: 'Master Mute',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					default: 'toggle',
					choices: [
						{ id: '1', label: 'Mute' },
						{ id: '0', label: 'Unmute' },
						{ id: 'toggle', label: 'Toggle' },
					],
				},
			],
			callback: (action) => {
				if (action.options.mode === 'toggle') {
					self.sendCommand(`MUTED ${self.state.muted ? 0 : 1}`)
				} else {
					self.sendCommand(`MUTED ${action.options.mode}`)
				}
			},
		},

		setFormat: {
			name: 'Select Format',
			options: [
				{
					type: 'textinput',
					id: 'format',
					label: 'Format name (must match exactly, spaces allowed)',
					default: 'Digital Cinema',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const format = await context.parseVariablesInString(action.options.format)
				self.sendCommand(`FORMAT ${format}`)
			},
		},

		runMacro: {
			name: 'Run Macro',
			options: [
				{
					type: 'textinput',
					id: 'macro',
					label: 'Macro name (must match exactly, spaces allowed)',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const macro = await context.parseVariablesInString(action.options.macro)
				self.sendCommand(`RUNMACRO ${macro}`)
			},
		},

		setMonitorLevel: {
			name: 'Set Monitor Level',
			options: [
				{
					type: 'number',
					id: 'level',
					label: 'Level (0 - 100)',
					default: 70,
					min: 0,
					max: 100,
					range: true,
				},
			],
			callback: (action) => {
				self.sendCommand(`MONITORLEVEL ${action.options.level}`)
			},
		},

		monitorMute: {
			name: 'Monitor Mute',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					default: 'toggle',
					choices: [
						{ id: '1', label: 'Mute' },
						{ id: '0', label: 'Unmute' },
						{ id: 'toggle', label: 'Toggle' },
					],
				},
			],
			callback: (action) => {
				if (action.options.mode === 'toggle') {
					self.sendCommand(`MONITORMUTE ${self.state.monitorMute ? 0 : 1}`)
				} else {
					self.sendCommand(`MONITORMUTE ${action.options.mode}`)
				}
			},
		},

		powerOn: {
			name: 'Power ON (runs configured macro)',
			options: [],
			callback: () => {
				self.sendCommand(`RUNMACRO ${self.config.powerOnMacro || 'PowerOn'}`)
			},
		},

		standby: {
			name: 'Standby (runs configured macro)',
			options: [],
			callback: () => {
				self.sendCommand(`RUNMACRO ${self.config.standbyMacro || 'Standby'}`)
			},
		},

		customCommand: {
			name: 'Send Custom Command',
			options: [
				{
					type: 'textinput',
					id: 'command',
					label: "Command without leading '@' or trailing CR (e.g. HEALTH TEMPERATURE)",
					default: '',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const cmd = await context.parseVariablesInString(action.options.command)
				if (cmd.length > 0) self.sendCommand(cmd)
			},
		},
	}
}
