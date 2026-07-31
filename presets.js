import { combineRgb } from '@companion-module/base'

export function getPresets(self) {
	const presets = {}

	presets['muteToggle'] = {
		type: 'button',
		category: 'Level',
		name: 'Mute Toggle',
		style: {
			text: 'MUTE\n$(datasat-ap2x:fader)',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'mute', options: { mode: 'toggle' } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'muted',
				options: {},
				style: {
					bgcolor: combineRgb(200, 0, 0),
					color: combineRgb(255, 255, 255),
				},
			},
		],
	}

	presets['faderUp'] = {
		type: 'button',
		category: 'Level',
		name: 'Fader +0.5',
		style: {
			text: 'VOL\n+',
			size: '24',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'faderRelative', options: { delta: 0.5 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['faderDown'] = {
		type: 'button',
		category: 'Level',
		name: 'Fader -0.5',
		style: {
			text: 'VOL\n-',
			size: '24',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'faderRelative', options: { delta: -0.5 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['fader70'] = {
		type: 'button',
		category: 'Level',
		name: 'Fader 7.0 (reference)',
		style: {
			text: 'REF\n7.0',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'setFader', options: { level: 7.0 } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'faderLevel',
				options: { comparison: 'eq', level: 7.0 },
				style: {
					bgcolor: combineRgb(0, 120, 0),
					color: combineRgb(255, 255, 255),
				},
			},
		],
	}

	presets['formatDigitalCinema'] = {
		type: 'button',
		category: 'Formats',
		name: 'Format: Digital Cinema',
		style: {
			text: 'Digital\nCinema',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'setFormat', options: { format: 'Digital Cinema' } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'format',
				options: { format: 'Digital Cinema' },
				style: {
					bgcolor: combineRgb(0, 120, 0),
					color: combineRgb(255, 255, 255),
				},
			},
		],
	}

	presets['monitorMuteToggle'] = {
		type: 'button',
		category: 'Monitor',
		name: 'Monitor Mute Toggle',
		style: {
			text: 'MON\nMUTE',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [{ actionId: 'monitorMute', options: { mode: 'toggle' } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'monitorMute',
				options: {},
				style: {
					bgcolor: combineRgb(200, 0, 0),
					color: combineRgb(255, 255, 255),
				},
			},
		],
	}

	return presets
}
