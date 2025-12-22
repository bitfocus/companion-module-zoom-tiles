import { CompanionActionDefinition } from '@companion-module/base'
import { createCommand, sendActionCommand } from './action-utilities/action-utils.js'
import { InstanceBaseExt, options } from '../utils.js'
import { ZoomConfig } from '../config.js'

export enum ActionIdJoinLeave {
	startPersonalMeeting = 'startPMI',
	startInstantMeeting = 'startIM',
	joinMeeting = 'joinMeeting',
	zakJoin = 'zakJoin',
	leaveMeeting = 'leaveMeeting',
}

export function GetActionsJoinLeave(instance: InstanceBaseExt<ZoomConfig>): {
	[id in ActionIdJoinLeave]: CompanionActionDefinition | undefined
} {
	const actions: { [id in ActionIdJoinLeave]: CompanionActionDefinition | undefined } = {
		[ActionIdJoinLeave.startPersonalMeeting]: {
			name: 'Start Personal Meeting ID',
			description: 'Start a meeting using your Personal Meeting ID',
			options: [],
			callback: (): void => {
				const command = createCommand('/startPMI')

				const sendToCommand = {
					id: 'startPMI',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdJoinLeave.startInstantMeeting]: {
			name: 'Start Instant Meeting',
			description: 'Start an instant meeting',
			options: [],
			callback: (): void => {
				const command = createCommand('/startIM')

				const sendToCommand = {
					id: 'startIM',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdJoinLeave.joinMeeting]: {
			name: 'Join Meeting',
			description: 'Join a meeting with Meeting ID, Password, and Display Name',
			options: [options.meetingID, options.password, options.name],
			callback: async (action): Promise<void> => {
				const command = createCommand('/joinMeeting')
				const name = await instance.parseVariablesInString(action.options.name as string)
				const meetingID = await instance.parseVariablesInString(action.options.meetingID as string)
				const password = await instance.parseVariablesInString(action.options.password as string)

				command.args.push({ type: 's', value: meetingID })
				command.args.push({ type: 's', value: password })
				command.args.push({ type: 's', value: name })

				const sendToCommand = {
					id: 'joinMeeting',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}

				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdJoinLeave.zakJoin]: {
			name: 'ZAK Join Meeting',
			description: 'Join a meeting using ZAK token, Meeting ID, Password, and Display Name',
			options: [options.zak, options.meetingID, options.password, options.name],
			callback: async (action): Promise<void> => {
				// type: 'Special'
				const command = createCommand('/zakJoin')
				const name = await instance.parseVariablesInString(action.options.name as string)
				const zak = await instance.parseVariablesInString(action.options.zak as string)
				const meetingId = await instance.parseVariablesInString(action.options.meetingID as string)
				const password = await instance.parseVariablesInString(action.options.password as string)
				command.args.push({ type: 's', value: zak })
				command.args.push({ type: 's', value: meetingId })
				command.args.push({ type: 's', value: name })
				command.args.push({ type: 's', value: password })
				const sendToCommand = {
					id: 'zakJoin',
					options: {
						command: command.oscPath,
						args: command.args,
					},
				}
				sendActionCommand(instance, sendToCommand)
			},
		},
		[ActionIdJoinLeave.leaveMeeting]: {
			name: 'Leave Meeting',
			description: 'Leave the current meeting',
			options: [],
			callback: (): void => {
				const command = createCommand('/leaveMeeting')

				const sendToCommand = {
					id: 'leaveMeeting',
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
