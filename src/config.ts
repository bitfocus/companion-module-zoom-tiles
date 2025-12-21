import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ZoomConfig {
	host: string
	rx_port: number
}
export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'rx_port',
			label: 'Zoom Tiles Receiving Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 3456,
		},
	]
}
