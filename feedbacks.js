import { combineRgb } from '@companion-module/base'

export function getFeedbacks(self) {
	return {
		muted: {
			type: 'boolean',
			name: 'Master output is muted',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => self.state.muted === 1,
		},

		monitorMute: {
			type: 'boolean',
			name: 'Monitor is muted',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => self.state.monitorMute === 1,
		},

		format: {
			type: 'boolean',
			name: 'Current format is',
			defaultStyle: {
				bgcolor: combineRgb(0, 120, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'textinput',
					id: 'format',
					label: 'Format name',
					default: 'Digital Cinema',
				},
			],
			callback: (feedback) => self.state.format === feedback.options.format,
		},

		powerFault: {
			type: 'boolean',
			name: 'Power supply fault (H336 voltages out of limits)',
			defaultStyle: {
				bgcolor: combineRgb(255, 102, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: () => self.state.powerOk === false,
		},

		faderLevel: {
			type: 'boolean',
			name: 'Fader level comparison',
			defaultStyle: {
				bgcolor: combineRgb(0, 120, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'dropdown',
					id: 'comparison',
					label: 'Comparison',
					default: 'eq',
					choices: [
						{ id: 'eq', label: '=' },
						{ id: 'gt', label: '>' },
						{ id: 'lt', label: '<' },
					],
				},
				{
					type: 'number',
					id: 'level',
					label: 'Level (0.0 - 10.0)',
					default: 7.0,
					min: 0,
					max: 10,
					step: 0.1,
				},
			],
			callback: (feedback) => {
				const target = Math.round(feedback.options.level * 10)
				switch (feedback.options.comparison) {
					case 'gt':
						return self.state.fader > target
					case 'lt':
						return self.state.fader < target
					default:
						return self.state.fader === target
				}
			},
		},
	}
}
