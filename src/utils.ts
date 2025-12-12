import {
	CompanionInputFieldDropdown,
	CompanionInputFieldNumber,
	CompanionInputFieldTextInput,
	InstanceBase,
} from '@companion-module/base'

// Force options to have a default to prevent sending undefined values
type EnforceDefault<T, U> = Omit<T, 'default'> & { default: U }

export interface Options {
	message: EnforceDefault<CompanionInputFieldTextInput, string>
	name: EnforceDefault<CompanionInputFieldTextInput, string>
	meetingID: EnforceDefault<CompanionInputFieldTextInput, string>
	path: EnforceDefault<CompanionInputFieldTextInput, string>
	id: EnforceDefault<CompanionInputFieldNumber, number>
	password: EnforceDefault<CompanionInputFieldTextInput, string>
	zak: EnforceDefault<CompanionInputFieldTextInput, string>
	video: EnforceDefault<CompanionInputFieldDropdown, number>
}

export const options: Options = {
	message: {
		type: 'textinput',
		label: 'Message',
		id: 'message',
		default: '',
	},
	name: {
		type: 'textinput',
		useVariables: true,
		label: 'Name',
		id: 'name',
		default: '',
	},
	meetingID: {
		type: 'textinput',
		useVariables: true,
		label: 'Meeting ID',
		id: 'meetingID',
		default: '',
	},
	path: {
		type: 'textinput',
		label: 'absolute path',
		id: 'path',
		default: '',
	},
	id: {
		type: 'number',
		label: 'ID',
		id: 'id',
		min: 0,
		max: 99999999,
		default: 0,
	},
	password: {
		type: 'textinput',
		label: 'Password(optional)',
		id: 'password',
		useVariables: true,
		default: '',
	},
	zak: {
		type: 'textinput',
		useVariables: true,
		label: 'Zak',
		id: 'zak',
		default: '',
	},
	video: {
		type: 'dropdown',
		label: 'Camera on/of',
		id: 'video',
		default: 0,
		choices: [
			{ id: 0, label: 'off' },
			{ id: 1, label: 'on' },
		],
	},
}

export interface InstanceBaseExt<TConfig> extends InstanceBase<TConfig> {
	OSC: any
	config: TConfig
}
