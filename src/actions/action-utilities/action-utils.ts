import { CompanionActionEvent } from '@companion-module/base'
import { ZoomConfig } from '../../config.js'
import { InstanceBaseExt } from '../../utils.js'

/**
 * createUserCommand function to create oscPath and arguments for user
 * @param actionID string
 * @param name string
 * @returns object { argsCallers: { type: string; value: string | number }[]; oscPath: string }
 */
export const createCommand = (
	OSCAction: string,
): {
	args: {
		type: string
		value: any
	}[]
	oscPath: string
	oscPathName: string
	isValidCommand: boolean
} => {
	const command: {
		args: { type: string; value: any }[]
		oscPath: string
		oscPathName: string
		isValidCommand: boolean
	} = {
		args: [],
		oscPath: '',
		oscPathName: '',
		isValidCommand: true,
	}

	command.oscPath = `/tiles${OSCAction}`

	return command
}

/**
 * Construct the command like I want and send it to the OSC
 * @param action
 * @param _info
 */
export const sendActionCommand = (
	instance: InstanceBaseExt<ZoomConfig>,
	action: { options: { command: any; args: any } },
	_info?: CompanionActionEvent | null,
): void => {
	// Construct command
	const oscPath = action.options.command
	const args = action.options.args
	instance.log('debug', `Sending ${JSON.stringify(oscPath)}, with arguments ${JSON.stringify(args)}`)
	if (instance.OSC) instance.OSC.sendCommand(oscPath, args)
}
