import { CompanionActionDefinition } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utilities/action-utils.js'
import { InstanceBaseExt } from '../utils.js'
import { ZoomConfig } from '../config.js'

export enum ActionIdConfig {
	loadConfiguration = 'loadConfiguration',
}

/**
 * @help-description
 * Load a Zoom Tiles configuration file to quickly apply saved settings.
 * Configuration files must be stored with an absolute path on the system running Zoom Tiles.
 */
export function GetActionsConfig(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdConfig]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdConfig]: CompanionActionDefinition | undefined } = {
		[ActionIdConfig.loadConfiguration]: {
			name: 'Load Configuration',
			description: 'Load a configuration file from an absolute path on disk.',
			options: [
				{
					type: 'textinput',
					label: 'Absolute Configuration Path',
					id: 'filePath',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action): Promise<void> => {
				const command = createCommand('/loadConfiguration')
				const rawPath = await instance.parseVariablesInString(action.options.filePath as string)
				const resolvedPath = rawPath.trim()

				if (resolvedPath.length === 0) {
					instance.log('error', 'Load Configuration requires a file path.')
					return
				}

				command.args.push({ type: 's', value: resolvedPath })

				const sendToCommand = {
					id: 'loadConfiguration',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
	}

	return actions
}
