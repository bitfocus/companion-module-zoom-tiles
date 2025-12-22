import { CompanionActionDefinition } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utilities/action-utils.js'
import { InstanceBaseExt } from '../utils.js'
import { ZoomConfig } from '../config.js'

export enum ActionIdCapture {
	startCaptureEngine = 'startCaptureEngine',
	stopCaptureEngine = 'stopCaptureEngine',
}

export function GetActionsCapture(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdCapture]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdCapture]: CompanionActionDefinition | undefined } = {
		[ActionIdCapture.startCaptureEngine]: {
			name: 'Start Capture Engine',
			options: [],
			callback: (): void => {
				const command = createCommand('/startCaptureEngine')

				const sendToCommand = {
					id: 'startCaptureEngine',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdCapture.stopCaptureEngine]: {
			name: 'Stop Capture Engine',
			options: [],
			callback: (): void => {
				const command = createCommand('/stopCaptureEngine')

				const sendToCommand = {
					id: 'stopCaptureEngine',
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
